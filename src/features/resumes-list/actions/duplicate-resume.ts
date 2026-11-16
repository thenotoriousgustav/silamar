"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

/**
 * Duplicates an existing resume. Creates a new row with the same content
 * but a new ID and title suffixed with "(Copy)".
 */
export async function duplicateResumeAction(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    // Fetch the original resume
    const [original] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (!original || original.userId !== user.id) {
      return { success: false, error: "Resume not found" };
    }

    const newId = crypto.randomUUID();
    const newTitle = `${original.title} (Copy)`;

    await db.insert(resumes).values({
      id: newId,
      userId: user.id,
      title: newTitle,
      content: original.content,
      templateId: original.templateId,
    });

    revalidatePath("/documents/resumes");
    updateTag("dashboard");

    return { success: true, data: { id: newId } };
  } catch {
    return { success: false, error: "Failed to duplicate resume" };
  }
}
