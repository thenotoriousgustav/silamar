"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

export interface JobForSelect {
  id: string;
  position: string;
  company: string;
  description: string | null;
}

/**
 * Fetches a lightweight list of job applications for use in select dropdowns.
 * Only returns fields needed for cover letter generation.
 */
export async function getJobsForSelectAction(): Promise<JobForSelect[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const rows = await db
    .select({
      id: jobApplications.id,
      position: jobApplications.position,
      company: jobApplications.company,
      description: jobApplications.description,
    })
    .from(jobApplications)
    .where(eq(jobApplications.userId, user.id))
    .orderBy(desc(jobApplications.updatedAt))
    .limit(100);

  return rows;
}
