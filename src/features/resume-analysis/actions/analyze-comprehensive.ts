"use server";

import { randomUUID } from "crypto";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { aiUsageLogs, resumeAnalyses, resumes, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { comprehensiveAnalysisResultSchema } from "../schemas/comprehensive-analysis";
import type { ComprehensiveAnalysisDTO } from "../types/resume-analyzer-dto";
import { buildComprehensiveAnalysisPrompt } from "../utils/comprehensive-prompt";

/**
 * Server action to perform a general (job-agnostic) comprehensive resume analysis.
 *
 * Evaluates the resume on its own merits: ATS compatibility, writing quality,
 * typos/grammar, formatting, completeness, action verbs, red flags.
 *
 * For job-fit analysis (resume vs a specific job), use `analyzeJobFit` instead.
 *
 * Costs 1 credit.
 */
export async function analyzeComprehensive(input: {
  resumeId: string;
}): Promise<ActionResult<ComprehensiveAnalysisDTO>> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [dbUser] = await db
      .select({ credits: users.credits, plan: users.plan })
      .from(users)
      .where(eq(users.id, user.id));

    if (!dbUser) {
      return { success: false, error: "User not found" };
    }

    const isPro = dbUser.plan === "pro";
    if (!isPro && dbUser.credits <= 0) {
      return {
        success: false,
        error: "Insufficient credits. Purchase credits to continue.",
      };
    }

    const [resume] = await db
      .select({ content: resumes.content })
      .from(resumes)
      .where(and(eq(resumes.id, input.resumeId), eq(resumes.userId, user.id)))
      .limit(1);

    if (!resume) {
      return { success: false, error: "Resume not found" };
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

    const prompt = buildComprehensiveAnalysisPrompt(resumeContent);

    const { output: result } = await generateText({
      model: openai("gpt-4.1-mini"),
      output: Output.object({ schema: comprehensiveAnalysisResultSchema }),
      prompt,
    });

    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: user.id,
      featureType: "resume_analyze",
      creditsUsed: isPro ? 0 : 1,
      inputData: { resumeId: input.resumeId },
      outputData: result,
    });

    await db.insert(resumeAnalyses).values({
      userId: user.id,
      resumeId: input.resumeId,
      overallScore: result.overallScore.total,
      grade: result.overallScore.grade,
      result: result,
    });

    return { success: true, data: result as ComprehensiveAnalysisDTO };
  } catch (error) {
    console.error("Comprehensive analysis error:", error);
    return {
      success: false,
      error: "An error occurred while analyzing the resume",
    };
  }
}
