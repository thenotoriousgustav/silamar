"use server";

import { randomUUID } from "crypto";

import { generateText, Output } from "ai";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { aiUsageLogs, resumes, users } from "@/db/schema";
import { defaultModel } from "@/lib/ai";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import {
  roastResultSchema,
  type RoastIntensity,
  type RoastResult,
} from "../schemas";
import { buildRoastPrompt } from "../utils/roast-prompt";

export interface RoastInput {
  resumeId: string;
  intensity: RoastIntensity;
}

/**
 * Server action to roast (mock) a user's resume in a fun, sarcastic way.
 * Costs 1 credit. Requires user to be authenticated and own the resume.
 */
export async function roastResumeAction(
  input: RoastInput,
): Promise<ActionResult<RoastResult>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Verify and deduct credit
  const [dbUser] = await db
    .select({ credits: users.credits, plan: users.plan })
    .from(users)
    .where(eq(users.id, user.id));

  if (!dbUser) return { success: false, error: "User not found" };

  const isPro = dbUser.plan === "pro";
  if (!isPro && dbUser.credits <= 0) {
    return {
      success: false,
      error: "Kredit tidak cukup. Beli kredit untuk melanjutkan.",
    };
  }

  // Fetch resume
  const [resume] = await db
    .select({ content: resumes.content, title: resumes.title })
    .from(resumes)
    .where(and(eq(resumes.id, input.resumeId), eq(resumes.userId, user.id)))
    .limit(1);

  if (!resume) {
    return { success: false, error: "Resume tidak ditemukan" };
  }

  // Deduct credit
  if (!isPro) {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1` })
      .where(eq(users.id, user.id));
  }

  try {
    const resumeContent =
      typeof resume.content === "string"
        ? resume.content
        : JSON.stringify(resume.content);

    const prompt = buildRoastPrompt(resumeContent, input.intensity);

    const { output: result } = await generateText({
      model: defaultModel,
      output: Output.object({ schema: roastResultSchema }),
      prompt,
    });

    // Log usage (using resume_analyze featureType since roast is a resume analysis variant)
    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: user.id,
      featureType: "resume_analyze",
      creditsUsed: isPro ? 0 : 1,
      inputData: {
        resumeId: input.resumeId,
        feature: "roast",
        intensity: input.intensity,
      },
      outputData: { brutalScore: result.brutalScore },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("[roastResumeAction] error:", error);
    // Refund on failure
    if (!isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + 1` })
        .where(eq(users.id, user.id));
    }
    return { success: false, error: "Gagal me-roast resume. Coba lagi." };
  }
}
