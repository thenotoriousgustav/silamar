import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { jobApplications, jobTrackers, resumes } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

import type { ResumeListItemWithDetailsDTO } from "./types/resume-list-item-dto";

const MAX_PAGE_SIZE = 50;

type PaginationParams = {
  page?: number;
  pageSize?: number;
};

/**
 * Fetches paginated resume list items with tracker details for the current user.
 * Uses column-specific selects and enforces max 50 records per request.
 */
export const getResumesDTO = cache(
  async (params?: PaginationParams): Promise<ResumeListItemWithDetailsDTO[]> => {
    const user = await getSessionUser();
    if (!user) return [];

    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.min(Math.max(1, params?.pageSize ?? MAX_PAGE_SIZE), MAX_PAGE_SIZE);
    const offset = (page - 1) * pageSize;

    const data = await db
      .select({
        id: resumes.id,
        title: resumes.title,
        atsScore: resumes.atsScore,
        content: resumes.content,
        updatedAt: resumes.updatedAt,
      })
      .from(resumes)
      .where(eq(resumes.userId, user.id))
      .orderBy(desc(resumes.updatedAt))
      .limit(pageSize)
      .offset(offset);

    if (data.length === 0) return [];

    // Fetch trackers for these resumes using column-specific select
    const resumeIds = data.map((r) => r.id);
    const appsWithTrackers = await db
      .select({
        resumeId: jobApplications.resumeId,
        trackerId: jobTrackers.id,
        trackerName: jobTrackers.name,
      })
      .from(jobApplications)
      .leftJoin(jobTrackers, eq(jobApplications.trackerId, jobTrackers.id))
      .where(
        and(
          eq(jobApplications.userId, user.id),
          inArray(jobApplications.resumeId, resumeIds),
        ),
      );

    return data.map((resume) => {
      const trackers = appsWithTrackers
        .filter((app) => app.resumeId === resume.id)
        .reduce(
          (acc, curr) => {
            if (curr.trackerId) {
              if (!acc.find((t) => t.id === curr.trackerId)) {
                acc.push({
                  id: curr.trackerId,
                  name: curr.trackerName || "Unknown",
                });
              }
            } else {
              if (!acc.find((t) => t.id === "default")) {
                acc.push({ id: "default", name: "Job Tracker" });
              }
            }
            return acc;
          },
          [] as { id: string; name: string }[],
        );

      return {
        id: resume.id,
        title: resume.title,
        atsScore: resume.atsScore,
        updatedAt: resume.updatedAt,
        content: resume.content,
        trackers,
      };
    });
  },
);
