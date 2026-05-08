import { db } from "@/db";
import { coverLetters } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export const getCoverLetterDTO = cache(async (id: string) => {
  const session = await getSession();
  if (!session?.user) return null;

  const result = await db
    .select()
    .from(coverLetters)
    .where(
      and(eq(coverLetters.id, id), eq(coverLetters.userId, session.user.id)),
    )
    .limit(1);

  return result[0] || null;
});
