"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { coverLetters } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

export async function deleteCoverLetterAction(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await db
      .delete(coverLetters)
      .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, user.id)));

    revalidatePath("/documents/cover-letter");
    return { success: true, data: { id } };
  } catch {
    return { success: false, error: "Failed to delete cover letter" };
  }
}
