import "server-only";

import { desc, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { jobTrackers } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

import type { JobTrackerDTO } from "../types/job-tracker-dto";

/**
 * Fetch job trackers for the current user.
 * Returns only the columns needed by the presentation layer.
 */
export const getTrackers = cache(async (): Promise<JobTrackerDTO[]> => {
  const user = await getSessionUser();
  if (!user) return [];

  const rows = await db
    .select({
      id: jobTrackers.id,
      name: jobTrackers.name,
      description: jobTrackers.description,
      createdAt: jobTrackers.createdAt,
      updatedAt: jobTrackers.updatedAt,
    })
    .from(jobTrackers)
    .where(eq(jobTrackers.userId, user.id))
    .orderBy(desc(jobTrackers.updatedAt));

  return rows;
});
