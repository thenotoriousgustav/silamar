"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

import { db } from "@/db";
import { jobTrackers } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

export async function deleteTracker(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const rows = await db
      .delete(jobTrackers)
      .where(and(eq(jobTrackers.id, id), eq(jobTrackers.userId, user.id)))
      .returning({ id: jobTrackers.id });

    if (rows.length === 0) {
      return { success: false, error: "Tracker tidak ditemukan" };
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/job-tracker");
    updateTag("dashboard");

    return { success: true, data: { id: rows[0].id } };
  } catch {
    return { success: false, error: "Gagal menghapus tracker" };
  }
}
