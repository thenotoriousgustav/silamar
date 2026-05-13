import "server-only";

import { desc, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { coverLetters } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

import type { CoverLetterListItemWithDetailsDTO } from "./types/cover-letter-list-item-dto";

const MAX_PAGE_SIZE = 50;

type PaginationParams = {
  page?: number;
  pageSize?: number;
};

/**
 * Fetches paginated cover letter list items for the current user.
 * Uses column-specific selects and enforces max 50 records per request.
 */
export const getCoverLettersDTO = cache(
  async (
    params?: PaginationParams,
  ): Promise<CoverLetterListItemWithDetailsDTO[]> => {
    const user = await getSessionUser();
    if (!user) return [];

    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.min(
      Math.max(1, params?.pageSize ?? MAX_PAGE_SIZE),
      MAX_PAGE_SIZE,
    );
    const offset = (page - 1) * pageSize;

    const rows = await db
      .select({
        id: coverLetters.id,
        title: coverLetters.title,
        jobTitle: coverLetters.jobTitle,
        company: coverLetters.company,
        content: coverLetters.content,
        updatedAt: coverLetters.updatedAt,
      })
      .from(coverLetters)
      .where(eq(coverLetters.userId, user.id))
      .orderBy(desc(coverLetters.updatedAt))
      .limit(pageSize)
      .offset(offset);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      jobTitle: row.jobTitle,
      company: row.company,
      content: row.content,
      updatedAt: row.updatedAt,
    }));
  },
);
