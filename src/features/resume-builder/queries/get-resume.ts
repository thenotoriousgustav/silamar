import "server-only";

import { and, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { resumes } from "@/db/schema";

import type { ResumeContent } from "../types/resume-content";
import type { ResumeDTO } from "../types/resume-dto";

/**
 * Fetches a single resume by ID for the given user.
 * Uses column-specific select to avoid fetching unnecessary data.
 * Wrapped in React cache() for request-level deduplication.
 */
export const getResumeById = cache(
  async (id: string, userId: string): Promise<ResumeDTO | null> => {
    const rows = await db
      .select({
        id: resumes.id,
        title: resumes.title,
        content: resumes.content,
        atsScore: resumes.atsScore,
        updatedAt: resumes.updatedAt,
      })
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      content: row.content as ResumeContent,
      atsScore: row.atsScore,
      updatedAt: row.updatedAt,
    };
  },
);
