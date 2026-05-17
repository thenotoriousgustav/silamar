"use server";

import { revalidatePath, updateTag } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import { insertResume } from "../queries/insert-resume";
import { createEmptyResumeSchema } from "../schemas";
import type { ResumeTemplateId } from "../types/resume-content";

export async function createEmptyResumeAction(
  templateId?: ResumeTemplateId,
): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = createEmptyResumeSchema.safeParse({
    templateId: templateId ?? "classic",
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const result = await insertResume({
      id: crypto.randomUUID(),
      userId: user.id,
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
          fontFamily: "Inter",
          fontSize: "text-[11px]",
          lineHeight: "relaxed",
          language: "en",
          templateId: parsed.data.templateId,
          paperSize: "A4",
        },
      },
    });

    revalidatePath("/documents/resumes");
    updateTag("dashboard");

    return { success: true, data: { id: result.id } };
  } catch {
    return { success: false, error: "Failed to create resume" };
  }
}
