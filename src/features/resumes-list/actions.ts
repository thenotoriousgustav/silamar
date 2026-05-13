"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { getResumesDTO } from "@/features/resumes-list/queries";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import type { ResumeListItemWithDetailsDTO } from "./types/resume-list-item-dto";

/**
 * Server Actions for Resumes List
 */

export async function getResumesAction(): Promise<ResumeListItemWithDetailsDTO[]> {
  return await getResumesDTO();
}

export async function deleteResumeAction(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, user.id)));

    revalidatePath("/documents/resumes");
    updateTag("dashboard");
    return { success: true, data: { id } };
  } catch {
    return { success: false, error: "Failed to delete resume" };
  }
}
