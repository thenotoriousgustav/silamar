"use server";

import { randomUUID } from "crypto";

import { generateText, Output } from "ai";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { aiUsageLogs, coverLetters, users } from "@/db/schema";
import { defaultModel } from "@/lib/ai";
import {
  buildCoverLetterPrompt,
  coverLetterSchema,
} from "@/lib/ai/prompts/cover-letter";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

export interface GenerateCoverLetterInput {
  jobTitle: string;
  company: string;
  jobDescription?: string;
  resumeContent: string;
  resumeId?: string;
  tone: "formal" | "friendly" | "professional";
}

/**
 * Generates a cover letter with AI and saves it to the database in one step.
 * Handles credit verification and deduction internally.
 */
export async function generateAndCreateCoverLetterAction(
  input: GenerateCoverLetterInput,
): Promise<ActionResult<{ id: string }>> {
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
      error: "Insufficient credits. Purchase credits to continue.",
    };
  }

  if (!isPro) {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1` })
      .where(eq(users.id, user.id));
  }

  try {
    const prompt = buildCoverLetterPrompt({
      resumeContent: input.resumeContent,
      jobTitle: input.jobTitle,
      company: input.company,
      jobDescription: input.jobDescription,
      tone: input.tone,
    });

    const { output: result } = await generateText({
      model: defaultModel,
      output: Output.object({ schema: coverLetterSchema }),
      prompt,
    });

    // Save generated cover letter
    const id = randomUUID();
    await db.insert(coverLetters).values({
      id,
      userId: user.id,
      resumeId: input.resumeId ?? null,
      jobTitle: input.jobTitle,
      company: input.company,
      title: `Cover Letter — ${input.jobTitle} @ ${input.company}`,
      content: result,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Log AI usage
    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: user.id,
      featureType: "cover_letter",
      creditsUsed: isPro ? 0 : 1,
      inputData: { jobTitle: input.jobTitle, company: input.company },
      outputData: {},
    });

    revalidatePath("/documents/cover-letter");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("[generateAndCreateCoverLetterAction]", error);
    // Refund credit on failure
    if (!isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + 1` })
        .where(eq(users.id, user.id));
    }
    return { success: false, error: "Failed to generate cover letter" };
  }
}
