"use server";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ResumeContent, ResumeTemplateId } from "@/features/resumes-list/types/resume";

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function createResumeAction(data: {
  id: string;
  title: string;
  content: ResumeContent;
}) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const newResume = await db
    .insert(resumes)
    .values({
      id: data.id,
      userId: session.user.id,
      title: data.title || "Resume Saya",
      content: data.content || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/documents/resumes");
  return newResume[0];
}

export async function updateResumeAction(
  id: string,
  data: {
    title?: string;
    content?: ResumeContent;
    atsScore?: number | null;
  },
) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const updatedResume = await db
    .update(resumes)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
    .returning();

  revalidatePath("/documents/resumes");
  revalidatePath(`/resume-builder/${id}`);
  return updatedResume[0];
}

export async function createEmptyResumeAction(
  templateId: ResumeTemplateId = "classic",
) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const newResume = await db
    .insert(resumes)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      title: "Resume Tanpa Judul",
      content: {
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: { label: "", url: "" },
          website: { label: "", url: "" },
          summary: "",
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        style: {
          fontFamily: "Helvetica",
          fontSize: "text-[11px]",
          lineHeight: "relaxed",
          language: "en",
          templateId: templateId,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/documents/resumes");
  return newResume[0];
}
