"use server";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ResumeContent } from "@/features/resumes-list/types/resume";
import { getResumesDTO } from "@/features/resumes-list/queries";

/**
 * Server Actions for Resume Builder
 */

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function getResumesAction() {
  return await getResumesDTO();
}



export async function deleteResumeAction(id: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  await db
    .delete(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

  revalidatePath("/documents/resumes");
  return { success: true };
}
