import { db } from "@/db";
import { coverLetters } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export const getCoverLettersDTO = cache(async () => {
  const session = await getSession();
  if (!session?.user) return [];

  return await db
    .select()
    .from(coverLetters)
    .where(eq(coverLetters.userId, session.user.id))
    .orderBy(desc(coverLetters.updatedAt));
});


