import "server-only";

import { and, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

import type { JobApplicationDTO } from "../types/job-application-dto";

/**
 * Fetch a single job application by ID, ensuring ownership.
 * Uses column-specific select.
 */
export const getJobById = cache(
  async (id: string): Promise<JobApplicationDTO | null> => {
    const user = await getSessionUser();
    if (!user) return null;

    const rows = await db
      .select({
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
      })
      .from(jobApplications)
      .where(
        and(eq(jobApplications.id, id), eq(jobApplications.userId, user.id)),
      )
      .limit(1);

    return rows[0] ?? null;
  },
);
