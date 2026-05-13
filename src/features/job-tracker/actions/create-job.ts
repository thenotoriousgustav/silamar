"use server";

import { revalidatePath, updateTag } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { createJobApplicationSchema } from "../schemas";
import type { JobApplicationDTO } from "../types/job-application-dto";

export async function createJob(
  input: unknown,
): Promise<ActionResult<JobApplicationDTO>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = createJobApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { appliedDate, interviewDate, offerDate, ...rest } = parsed.data;

  try {
    const rows = await db
      .insert(jobApplications)
      .values({
        id: uuidv4(),
        userId: user.id,
        ...rest,
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        offerDate: offerDate ? new Date(offerDate) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: jobApplications.id,
        trackerId: jobApplications.trackerId,
        resumeId: jobApplications.resumeId,
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

    revalidatePath("/job-tracker");
    updateTag("dashboard");

    return { success: true, data: rows[0] };
  } catch {
    return { success: false, error: "Gagal membuat lamaran kerja" };
  }
}
