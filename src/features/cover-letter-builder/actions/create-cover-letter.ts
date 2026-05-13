"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { createCoverLetterQuery } from "../queries/create-cover-letter";

export async function createEmptyCoverLetterAction(): Promise<
  ActionResult<{ id: string }>
> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const result = await createCoverLetterQuery(user.id);

    revalidatePath("/documents/cover-letter");

    return { success: true, data: { id: result.id } };
  } catch {
    return { success: false, error: "Failed to create cover letter" };
  }
}
