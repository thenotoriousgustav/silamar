import "server-only";

import { db } from "@/db";
import { resumes } from "@/db/schema";

type InsertResumeParams = {
  id: string;
  userId: string;
  title: string;
  content: Record<string, unknown>;
};

/**
 * Inserts a new resume into the database.
 * Returns the created resume's id.
 */
export async function insertResume(
  params: InsertResumeParams,
): Promise<{ id: string }> {
  const rows = await db
    .insert(resumes)
    .values({
      id: params.id,
      userId: params.userId,
      title: params.title,
      content: params.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: resumes.id });

  return { id: rows[0].id };
}
