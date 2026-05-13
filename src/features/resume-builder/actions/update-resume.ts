"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { updateResumeQuery } from "../queries/update-resume";
import { updateResumeSchema } from "../schemas";

export async function updateResumeAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = updateResumeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const result = await updateResumeQuery(id, user.id, parsed.data);
    if (!result) return { success: false, error: "Resume not found" };

    revalidatePath("/documents/resumes");
    revalidatePath(`/resume-builder/${id}`);

    return { success: true, data: { id: result.id } };
  } catch {
    return { success: false, error: "Failed to update resume" };
  }
}
