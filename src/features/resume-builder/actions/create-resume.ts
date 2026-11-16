"use server";

import { revalidatePath, updateTag } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { insertResume } from "../queries/insert-resume";
import { createResumeSchema } from "../schemas";

export async function createResumeAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = createResumeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const result = await insertResume({
      id: parsed.data.id,
      userId: user.id,
      title: parsed.data.title || "Resume Saya",
      content: parsed.data.content,
    });

    revalidatePath("/documents/resumes");
    updateTag("dashboard");

    return { success: true, data: { id: result.id } };
  } catch {
    return { success: false, error: "Failed to create resume" };
  }
}
