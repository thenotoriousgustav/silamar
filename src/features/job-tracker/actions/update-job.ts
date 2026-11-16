"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { updateJobApplicationSchema } from "../schemas";
import type { JobApplicationDTO } from "../types/job-application-dto";

export async function updateJob(
  id: string,
  input: unknown,
): Promise<ActionResult<JobApplicationDTO>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = updateJobApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { appliedDate, interviewDate, offerDate, ...updates } = parsed.data;

  const processedUpdates: Record<string, unknown> = { ...updates };
  if (appliedDate !== undefined) {
    processedUpdates.appliedDate = appliedDate ? new Date(appliedDate) : null;
  }
  if (interviewDate !== undefined) {
    processedUpdates.interviewDate = interviewDate
      ? new Date(interviewDate)
      : null;
  }
  if (offerDate !== undefined) {
    processedUpdates.offerDate = offerDate ? new Date(offerDate) : null;
  }

  try {
    const rows = await db
      .update(jobApplications)
      .set({
        ...processedUpdates,
        updatedAt: new Date(),
      })
      .where(
        and(eq(jobApplications.id, id), eq(jobApplications.userId, user.id)),
      )
      .returning({
        id: jobApplications.id,
        trackerId: jobApplications.trackerId,
        resumeId: jobApplications.resumeId,
        coverLetterId: jobApplications.coverLetterId,
        company: jobApplications.company,
        position: jobApplications.position,
        location: jobApplications.location,
        logoUrl: jobApplications.logoUrl,
        salary: jobApplications.salary,
        type: jobApplications.type,
        status: jobApplications.status,
        appliedDate: jobApplications.appliedDate,
        interviewDate: jobApplications.interviewDate,
        offerDate: jobApplications.offerDate,
        notes: jobApplications.notes,
        jobUrl: jobApplications.jobUrl,
        description: jobApplications.description,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
      });

    if (rows.length === 0) {
      return { success: false, error: "Lamaran tidak ditemukan" };
    }

    revalidatePath("/job-tracker");

    return { success: true, data: rows[0] };
  } catch {
    return { success: false, error: "Gagal memperbarui lamaran" };
  }
}
