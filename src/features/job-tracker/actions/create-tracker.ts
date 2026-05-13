"use server";

import { revalidatePath, updateTag } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db";
import { jobTrackers } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { createTrackerSchema } from "../schemas";
import type { JobTrackerDTO } from "../types/job-tracker-dto";

export async function createTracker(
  input: unknown,
): Promise<ActionResult<JobTrackerDTO>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = createTrackerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const rows = await db
      .insert(jobTrackers)
      .values({
        id: uuidv4(),
        userId: user.id,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: jobTrackers.id,
        name: jobTrackers.name,
        description: jobTrackers.description,
        createdAt: jobTrackers.createdAt,
        updatedAt: jobTrackers.updatedAt,
      });

    revalidatePath("/dashboard", "layout");
    revalidatePath("/job-tracker");
    updateTag("dashboard");

    return { success: true, data: rows[0] };
  } catch {
    return { success: false, error: "Gagal membuat tracker" };
  }
}
