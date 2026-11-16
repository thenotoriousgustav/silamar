"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { updateCoverLetterQuery } from "../queries/update-cover-letter";
import { updateCoverLetterSchema } from "../schemas";
import type { UpdateCoverLetterInput } from "../schemas";

export async function updateCoverLetterAction(
  id: string,
  input: UpdateCoverLetterInput,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = updateCoverLetterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const result = await updateCoverLetterQuery(id, user.id, parsed.data);
    if (!result) return { success: false, error: "Cover letter not found" };

    revalidatePath("/documents/cover-letter");
    revalidatePath(`/cover-letter-builder/${id}`);

    return { success: true, data: { id: result.id } };
  } catch {
    return { success: false, error: "Failed to update cover letter" };
  }
}
