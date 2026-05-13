"use server";

import { randomUUID } from "crypto";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { aiUsageLogs, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";


import {
  analyzeResumeJobMatchSchema,
  resumeJobMatchResultSchema,
} from "../schemas";
import type { ResumeJobMatchDTO } from "../types/resume-analysis-dto";
import { buildResumeAnalyzeJdPrompt } from "../utils/prompts";

/**
 * Server action to analyze resume vs job description match.
 * Validates input, checks credits, calls AI, logs usage, and returns DTO.
 */
export async function analyzeResumeJobMatch(
  input: unknown,
): Promise<ActionResult<ResumeJobMatchDTO>> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = analyzeResumeJobMatchSchema.safeParse(input);
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

    const prompt = buildResumeAnalyzeJdPrompt(
      parsed.data.resumeContent,
      parsed.data.jobDescription,
    );

    const { output: result } = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({ schema: resumeJobMatchResultSchema }),
      prompt,
    });

    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: user.id,
      featureType: "resume_analyze_jd",
      creditsUsed: isPro ? 0 : 1,
      inputData: {},
      outputData: { matchScore: result.matchScore },
    });

    const data: ResumeJobMatchDTO = {
      matchScore: result.matchScore,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      suggestions: result.suggestions,
      verdict: result.verdict,
    };

    return { success: true, data };
  } catch {
    return {
      success: false,
      error: "Terjadi kesalahan saat menganalisis kecocokan resume",
    };
  }
}
