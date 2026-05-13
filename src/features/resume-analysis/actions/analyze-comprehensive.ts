"use server";

import { randomUUID } from "crypto";

import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { aiUsageLogs, resumes, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { comprehensiveAnalysisResultSchema } from "../schemas/comprehensive-analysis";
import type { ComprehensiveAnalysisDTO } from "../types/resume-analyzer-dto";
import { buildComprehensiveAnalysisPrompt } from "../utils/comprehensive-prompt";

/**
 * Server action to perform comprehensive resume analysis.
 * Fetches resume content from DB, calls AI, logs usage, returns DTO.
 * Costs 1 credit using gpt-4o-mini.
 */
export async function analyzeComprehensive(input: {
  resumeId: string;
  jobDescription?: string;
}): Promise<ActionResult<ComprehensiveAnalysisDTO>> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Fetch user info
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

    // Fetch resume content
    const [resume] = await db
      .select({ content: resumes.content })
      .from(resumes)
      .where(and(eq(resumes.id, input.resumeId), eq(resumes.userId, user.id)))
      .limit(1);

    if (!resume) {
      return { success: false, error: "Resume tidak ditemukan" };
    }

    const resumeContent =
      typeof resume.content === "string"
        ? resume.content
        : JSON.stringify(resume.content);

    // Deduct credit
    if (!isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.id, user.id));
    }

    // Call AI
    const prompt = buildComprehensiveAnalysisPrompt(
      resumeContent,
      input.jobDescription,
    );

    const { output: result } = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({ schema: comprehensiveAnalysisResultSchema }),
      prompt,
    });

    // Log usage
    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: user.id,
      featureType: "resume_analyze",
      creditsUsed: isPro ? 0 : 1,
      inputData: {},
      outputData: { overallScore: result.overallScore.total },
    });

    return { success: true, data: result as ComprehensiveAnalysisDTO };
  } catch (error) {
    console.error("Comprehensive analysis error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menganalisis resume",
    };
  }
}
