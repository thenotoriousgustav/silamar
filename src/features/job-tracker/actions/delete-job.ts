"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

export async function deleteJob(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const rows = await db
      .delete(jobApplications)
      .where(
        and(
          eq(jobApplications.id, id),
          eq(jobApplications.userId, user.id),
        ),
      )
      .returning({ id: jobApplications.id });

    if (rows.length === 0) {
      return { success: false, error: "Lamaran tidak ditemukan" };
    }

    revalidatePath("/job-tracker");
    updateTag("dashboard");

    return { success: true, data: { id: rows[0].id } };
  } catch {
    return { success: false, error: "Gagal menghapus lamaran" };
  }
}
