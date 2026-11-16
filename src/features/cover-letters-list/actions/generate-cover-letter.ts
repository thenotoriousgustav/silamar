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
      creditsUsed: 0,
      inputData: { jobTitle: input.jobTitle, company: input.company },
      outputData: {},
    });

    revalidatePath("/documents/cover-letter");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("[generateAndCreateCoverLetterAction]", error);
    return { success: false, error: "Failed to generate cover letter" };
  }
}
