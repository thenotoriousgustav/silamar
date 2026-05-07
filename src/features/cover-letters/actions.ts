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

export async function createCoverLetterAction(data: {
  title: string;
  content: CoverLetterBuilderData;
}) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const newId = crypto.randomUUID();

  const insertData: any = {
    id: newId,
    userId: session.user.id,
    title: data.title || "Cover Letter Tanpa Judul",
    content: data.content,
    company: data.content.companyName || "",
    jobTitle: data.content.subject || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const newLetter = await db
    .insert(coverLetters)
    .values(insertData)
    .returning();

  revalidatePath("/documents/cover-letter");
  return newLetter[0];
}

export async function updateCoverLetterAction(
  id: string,
  data: {
    title?: string;
    content?: CoverLetterBuilderData;
  },
) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const updateData: any = { ...data };
  if (data.content) {
    if (data.content.companyName) updateData.company = data.content.companyName;
    if (data.content.subject) updateData.jobTitle = data.content.subject;
  }

  const updated = await db
    .update(coverLetters)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(
      and(eq(coverLetters.id, id), eq(coverLetters.userId, session.user.id)),
    )
    .returning();

  revalidatePath("/documents/cover-letter");
  revalidatePath(`/documents/cover-letter/${id}`);
  return updated[0];
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
