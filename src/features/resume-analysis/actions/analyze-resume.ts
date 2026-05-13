"use server";

import { randomUUID } from "crypto";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { aiUsageLogs, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { analyzeResumeSchema, resumeAnalysisResultSchema } from "../schemas";
import type { ResumeAnalysisDTO } from "../types/resume-analysis-dto";
import { buildResumeAnalyzePrompt } from "../utils/prompts";

/**
 * Server action to analyze a resume for ATS compatibility.
 * Validates input, checks credits, calls AI, logs usage, and returns DTO.
 */
export async function analyzeResume(
  input: unknown,
): Promise<ActionResult<ResumeAnalysisDTO>> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = analyzeResumeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

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

    if (!isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.id, user.id));
    }

    const prompt = buildResumeAnalyzePrompt(parsed.data.resumeContent);

    const { output: result } = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({ schema: resumeAnalysisResultSchema }),
      prompt,
    });

    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: user.id,
      featureType: "resume_analyze",
      creditsUsed: isPro ? 0 : 1,
      inputData: {},
      outputData: { atsScore: result.atsScore },
    });

    const data: ResumeAnalysisDTO = {
      atsScore: result.atsScore,
      overallFeedback: result.overallFeedback,
      strengths: result.strengths,
      improvements: result.improvements,
      keywordSuggestions: result.keywordSuggestions,
      sectionScores: result.sectionScores,
    };

    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "Terjadi kesalahan saat menganalisis resume",
    };
  }
}
