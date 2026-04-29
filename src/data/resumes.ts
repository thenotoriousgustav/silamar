import "server-only";

import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

/**
 * Get current session user, redirected to login if not found.
 * Memoized per request.
 */
export const getSessionUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return session.user;
});

/**
 * Data Access Layer for Resumes
 */

export const getResumesDTO = async () => {
  const user = await getSessionUser();
  if (!user) return [];

  const data = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, user.id))
    .orderBy(desc(resumes.updatedAt));

  return data;
};

export const getResumeDTO = async (id: string) => {
  const user = await getSessionUser();
  if (!user) return null;

  const data = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, id), eq(resumes.userId, user.id)),
  });

  if (!data) return null;

  return {
    ...data,
    content: data.content,
  };
};
