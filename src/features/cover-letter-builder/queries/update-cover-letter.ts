import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { coverLetters } from "@/db/schema";

import type { UpdateCoverLetterInput } from "../schemas";

export async function updateCoverLetterQuery(
  id: string,
  userId: string,
  data: UpdateCoverLetterInput,
): Promise<{ id: string } | null> {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.content !== undefined) {
    updateData.content = data.content;
    if (data.content.companyName) {
      updateData.company = data.content.companyName;
    }
    if (data.content.subject) {
      updateData.jobTitle = data.content.subject;
    }
  }

  const rows = await db
    .update(coverLetters)
    .set(updateData)
    .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)))
    .returning({ id: coverLetters.id });

  if (rows.length === 0) return null;

  return { id: rows[0].id };
}
