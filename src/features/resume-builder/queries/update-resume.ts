import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { resumes } from "@/db/schema";

type UpdateResumeParams = {
  title?: string;
  content?: Record<string, unknown>;
  atsScore?: number | null;
};

/**
 * Updates a resume by ID for the given user.
 * Uses column-specific returning to avoid fetching unnecessary data.
 * Returns null if the resume doesn't exist or doesn't belong to the user.
 */
export async function updateResumeQuery(
  id: string,
  userId: string,
  data: UpdateResumeParams,
): Promise<{ id: string } | null> {
  const rows = await db
    .update(resumes)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
    .returning({ id: resumes.id });

  if (rows.length === 0) return null;

  return { id: rows[0].id };
}
