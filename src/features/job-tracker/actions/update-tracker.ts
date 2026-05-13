"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { jobTrackers } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { updateTrackerSchema } from "../schemas";
import type { JobTrackerDTO } from "../types/job-tracker-dto";

export async function updateTracker(
  id: string,
  input: unknown,
): Promise<ActionResult<JobTrackerDTO>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = updateTrackerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const rows = await db
      .update(jobTrackers)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(and(eq(jobTrackers.id, id), eq(jobTrackers.userId, user.id)))
      .returning({
        id: jobTrackers.id,
        name: jobTrackers.name,
        description: jobTrackers.description,
        createdAt: jobTrackers.createdAt,
        updatedAt: jobTrackers.updatedAt,
      });

    if (rows.length === 0) {
      return { success: false, error: "Tracker tidak ditemukan" };
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/job-tracker");

    return { success: true, data: rows[0] };
  } catch {
    return { success: false, error: "Gagal memperbarui tracker" };
  }
}
