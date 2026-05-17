"use server";

import { randomUUID } from "crypto";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { aiUsageLogs, jobFitAnalyses, resumes, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import {
  analyzeJobFitInputSchema,
  jobFitResultSchema,
  type AnalyzeJobFitInput,
  type JobFitDTO,
} from "../schemas/job-fit";
import { buildJobFitPrompt } from "../utils/job-fit-prompt";

const MODEL_ID = "gpt-4.1-mini";

/**
 * Result wrapper returned by analyzeJobFit — adds the persisted row id so the
 * client can link to / refresh history without re-fetching everything.
 */
export type JobFitAnalysisResult = {
  id: string;
  data: JobFitDTO;
};

/**
 * Server action: analyze how well a stored resume fits a target job.
 *
 * The result enforces a strict, honest scoring rubric (see prompt) so that
 * obviously mismatched applications (e.g. IT resume vs courier role) score
 * very low instead of being inflated by transferable skills.
 *
 * Costs 1 credit (free for Pro plans).
 */
export async function analyzeJobFit(
  input: unknown,
): Promise<ActionResult<JobFitAnalysisResult>> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = analyzeJobFitInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const data: AnalyzeJobFitInput = parsed.data;

  try {
    const [dbUser] = await db
      .select({ credits: users.credits, plan: users.plan })
      .from(users)
      .where(eq(users.id, user.id));

    if (!dbUser) {
      return { success: false, error: "User tidak ditemukan" };
    }

    const isPro = dbUser.plan === "pro";
    if (!isPro && dbUser.credits <= 0) {
      return {
        success: false,
        error: "Kredit tidak cukup. Beli kredit untuk melanjutkan.",
      };
    }

    const [resume] = await db
      .select({ content: resumes.content })
      .from(resumes)
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .limit(1);

    if (!resume) {
      return { success: false, error: "Resume tidak ditemukan" };
    }

    const resumeContent =
      typeof resume.content === "string"
        ? resume.content
        : JSON.stringify(resume.content);

    if (!isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.id, user.id));
    }

    const prompt = buildJobFitPrompt(resumeContent, {
      jobTitle: data.jobTitle,
      company: data.company,
      jobDescription: data.jobDescription,
    });

    const { output: aiResult } = await generateText({
      model: openai(MODEL_ID),
      output: Output.object({ schema: jobFitResultSchema }),
      prompt,
    });

    // Defense in depth: enforce the domain-mismatch hard cap server-side too,
    // in case the model ignores the prompt rules.
    const result = enforceScoringGuards(aiResult);

    // Persist analysis for history. Failure here should NOT abort the user's
    // request (they already paid the credit and the result is in-memory),
    // so we log and fall back to a synthetic id.
    let analysisId: string = randomUUID();
    try {
      const [row] = await db
        .insert(jobFitAnalyses)
        .values({
          userId: user.id,
          resumeId: data.resumeId,
          jobId: data.jobId ?? null,
          jobTitle: data.jobTitle ?? null,
          company: data.company ?? null,
          jobDescription: data.jobDescription,
          matchScore: result.matchScore,
          decision: result.verdict.decision,
          shouldApply: result.verdict.shouldApply,
          result,
        })
        .returning({ id: jobFitAnalyses.id });
      if (row) analysisId = row.id;
    } catch (persistError) {
      console.error("Failed to persist job fit analysis:", persistError);
    }

    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: user.id,
      featureType: "resume_analyze_jd",
      creditsUsed: isPro ? 0 : 1,
      inputData: {
        resumeId: data.resumeId,
        jobId: data.jobId ?? null,
        jobTitle: data.jobTitle ?? null,
      },
      outputData: {
        matchScore: result.matchScore,
        decision: result.verdict.decision,
        analysisId,
      },
    });

    return { success: true, data: { id: analysisId, data: result } };
  } catch (error) {
    console.error("Job fit analysis error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menganalisis kecocokan resume",
    };
  }
}

/**
 * Enforces the scoring rules from the prompt at the server level so a
 * misbehaving model cannot bypass them.
 */
function enforceScoringGuards(result: JobFitDTO): JobFitDTO {
  const next = { ...result };

  // Domain mismatch hard gate.
  if (!next.domainAlignment.isCompatible) {
    next.domainAlignment = {
      ...next.domainAlignment,
      score: Math.min(next.domainAlignment.score, 20),
    };
    next.matchScore = Math.min(next.matchScore, 25);
    if (
      next.verdict.decision !== "poor_fit" &&
      next.verdict.decision !== "not_fit"
    ) {
      next.verdict = {
        ...next.verdict,
        decision: "not_fit",
        shouldApply: false,
      };
    } else {
      next.verdict = { ...next.verdict, shouldApply: false };
    }
  }

  // Must-have skill gaps.
  const missingMustHaves = next.skillsAnalysis.missing.filter(
    (m) => m.importance === "must_have",
  ).length;
  if (missingMustHaves >= 4) {
    next.matchScore = Math.min(next.matchScore, 45);
  } else if (missingMustHaves >= 2) {
    next.matchScore = Math.min(next.matchScore, 60);
  }

  // Underqualified seniority cap.
  if (next.roleAlignment.seniorityMatch === "underqualified") {
    next.matchScore = Math.min(next.matchScore, 55);
  }

  // Keep shouldApply consistent with score.
  if (next.matchScore < 40 && next.verdict.shouldApply) {
    next.verdict = { ...next.verdict, shouldApply: false };
  }

  return next;
}
