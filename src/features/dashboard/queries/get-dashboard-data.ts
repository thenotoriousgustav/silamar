import "server-only";

import { count, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/db";
import { aiUsageLogs, jobApplications, resumes } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

export type RecentJobItem = {
  id: string;
  position: string;
  company: string;
  status: string;
  createdAt: Date;
};

export type RecentActivityItem = {
  id: string;
  featureType: string;
  creditsUsed: number;
  createdAt: Date;
};

export type DashboardData = {
  resumeCount: number;
  jobCount: number;
  recentJobs: RecentJobItem[];
  recentActivity: RecentActivityItem[];
};

/**
 * Fetches aggregated dashboard data for the current user.
 * Uses unstable_cache with 60s revalidation for infrequently-changing data,
 * Promise.all for parallel independent data fetches, and
 * column-specific selects to minimize data transfer.
 */
export const getDashboardData = cache(
  async (): Promise<DashboardData | null> => {
    const user = await getSessionUser();
    if (!user) return null;

    return getCachedDashboardData(user.id);
  },
);

const getCachedDashboardData = unstable_cache(
  async (userId: string): Promise<DashboardData> => {
    const [resumeCountResult, jobCountResult, recentJobs, recentActivity] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(resumes)
          .where(eq(resumes.userId, userId)),
        db
          .select({ count: count() })
          .from(jobApplications)
          .where(eq(jobApplications.userId, userId)),
        db
          .select({
            id: jobApplications.id,
            position: jobApplications.position,
            company: jobApplications.company,
            status: jobApplications.status,
            createdAt: jobApplications.createdAt,
          })
          .from(jobApplications)
          .where(eq(jobApplications.userId, userId))
          .orderBy(desc(jobApplications.createdAt))
          .limit(5),
        db
          .select({
            id: aiUsageLogs.id,
            featureType: aiUsageLogs.featureType,
            creditsUsed: aiUsageLogs.creditsUsed,
            createdAt: aiUsageLogs.createdAt,
          })
          .from(aiUsageLogs)
          .where(eq(aiUsageLogs.userId, userId))
          .orderBy(desc(aiUsageLogs.createdAt))
          .limit(5),
      ]);

    return {
      resumeCount: resumeCountResult[0]?.count ?? 0,
      jobCount: jobCountResult[0]?.count ?? 0,
      recentJobs,
      recentActivity,
    };
  },
  ["dashboard-data"],
  { revalidate: 60, tags: ["dashboard"] },
);
