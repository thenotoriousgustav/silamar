import "server-only";

import { and, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { coverLetters } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

import type { CoverLetterBuilderData } from "../types/cover-letter-content";
import type { CoverLetterDTO } from "../types/cover-letter-dto";

export const getCoverLetterById = cache(
  async (id: string): Promise<CoverLetterDTO | null> => {
    const user = await getSessionUser();
    if (!user) return null;

    const rows = await db
      .select({
        id: coverLetters.id,
        title: coverLetters.title,
        content: coverLetters.content,
        company: coverLetters.company,
        jobTitle: coverLetters.jobTitle,
        updatedAt: coverLetters.updatedAt,
      })
      .from(coverLetters)
      .where(
        and(eq(coverLetters.id, id), eq(coverLetters.userId, user.id)),
      )
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];

    return {
      id: row.id,
      title: row.title,
      content: row.content as CoverLetterBuilderData,
      company: row.company,
      jobTitle: row.jobTitle,
      updatedAt: row.updatedAt,
    };
  },
);
