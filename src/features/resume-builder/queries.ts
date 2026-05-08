import "server-only";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";

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
