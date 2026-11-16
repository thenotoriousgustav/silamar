"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

/**
 * Deletes multiple resumes at once. Only deletes resumes owned by the
 * authenticated user.
 */
export async function bulkDeleteResumesAction(
  ids: string[],
): Promise<ActionResult<{ deletedCount: number }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  if (ids.length === 0) {
    return { success: false, error: "No resumes selected" };
  }

  try {
    const result = await db
      .delete(resumes)
      .where(and(inArray(resumes.id, ids), eq(resumes.userId, user.id)));

    revalidatePath("/documents/resumes");
    updateTag("dashboard");

    return { success: true, data: { deletedCount: result.rowCount ?? ids.length } };
  } catch {
    return { success: false, error: "Failed to delete resumes" };
  }
}
