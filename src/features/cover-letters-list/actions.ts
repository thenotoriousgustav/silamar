"use server";

import { db } from "@/db";
import { coverLetters } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { CoverLetterBuilderData } from "./schema";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}



export async function deleteCoverLetterAction(id: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  await db
    .delete(coverLetters)
    .where(
      and(eq(coverLetters.id, id), eq(coverLetters.userId, session.user.id)),
    );

  revalidatePath("/documents/cover-letter");
  return { success: true };
}
