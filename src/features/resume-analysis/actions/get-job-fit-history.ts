"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { jobFitAnalyses } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import type { JobFitDTO } from "../schemas/job-fit";

export type JobFitHistoryItem = {
  id: string;
  createdAt: Date;
  resumeId: string;
  jobId: string | null;
  jobTitle: string | null;
  company: string | null;
  matchScore: number;
  decision: JobFitDTO["verdict"]["decision"];
  shouldApply: boolean;
  result: JobFitDTO;
};

/**
 * Fetches the job-fit analysis history for the current user, optionally
 * scoped to a specific resume or tracked job.
 */
export async function getJobFitHistory(filter?: {
  resumeId?: string;
  jobId?: string;
  limit?: number;
}): Promise<ActionResult<JobFitHistoryItem[]>> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const conditions = [eq(jobFitAnalyses.userId, user.id)];
    if (filter?.resumeId) {
      conditions.push(eq(jobFitAnalyses.resumeId, filter.resumeId));
    }
    if (filter?.jobId) {
      conditions.push(eq(jobFitAnalyses.jobId, filter.jobId));
    }

    const rows = await db
      .select({
        id: jobFitAnalyses.id,
        createdAt: jobFitAnalyses.createdAt,
        resumeId: jobFitAnalyses.resumeId,
        jobId: jobFitAnalyses.jobId,
        jobTitle: jobFitAnalyses.jobTitle,
        company: jobFitAnalyses.company,
        matchScore: jobFitAnalyses.matchScore,
        decision: jobFitAnalyses.decision,
        shouldApply: jobFitAnalyses.shouldApply,
        result: jobFitAnalyses.result,
      })
      .from(jobFitAnalyses)
      .where(and(...conditions))
      .orderBy(desc(jobFitAnalyses.createdAt))
      .limit(filter?.limit ?? 50);

    const data: JobFitHistoryItem[] = rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      resumeId: row.resumeId,
      jobId: row.jobId,
      jobTitle: row.jobTitle,
      company: row.company,
      matchScore: row.matchScore,
      decision: row.decision,
      shouldApply: row.shouldApply,
      result: row.result as JobFitDTO,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Fetch job fit history error:", error);
    return { success: false, error: "Gagal memuat riwayat analisis" };
  }
}
