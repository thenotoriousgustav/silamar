"use client";

import type { ResumeContent } from "@/types/resume";

import { getTemplate } from "../templates/registry";

interface ResumeTemplateProps {
  data: ResumeContent;
}

/**
 * Top-level PDF entrypoint. Resolves the active template from the registry
 * and delegates rendering. Shared logic (sections, summary, fonts, base
 * styles) lives in `templates/shared/`.
 */
export function ResumeTemplate({ data }: ResumeTemplateProps) {
  const template = getTemplate(data.style?.templateId);
  const Template = template.Pdf;
  return <Template data={data} />;
}
