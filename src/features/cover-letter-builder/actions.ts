"use server";

import { db } from "@/db";
import { coverLetters } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { CoverLetterBuilderData } from "@/features/cover-letters-list/schema";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
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
  revalidatePath(`/cover-letter-builder/${id}`);
  return updated[0];
}

export async function createEmptyCoverLetterAction() {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const newLetter = await db
    .insert(coverLetters)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      title: "Cover Letter Tanpa Judul",
      content: {
        fullName: "",
        phone: "",
        email: "",
        address: "",
        cityAndPostal: "",
        recipientName: "",
        companyName: "",
        department: "",
        recipientAddress: "",
        recipientCityAndPostal: "",
        subject: "",
        content: "",
      },
      company: "",
      jobTitle: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/documents/cover-letter");
  return newLetter[0];
}
