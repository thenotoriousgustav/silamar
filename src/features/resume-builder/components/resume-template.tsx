"use client";

import type { ResumeContent } from "@/types/resume";

import { getTemplate } from "../templates/registry";

interface ResumeTemplateProps {
  data: ResumeContent;
}

/**
 * Top-level PDF entrypoint. Resolves the active template from the registry
 * and delegates rendering. Each template's PDF component is responsible for
 * its own header layout; shared logic (sections, summary, fonts, base
 * styles) lives in `templates/_shared/`.
 */
export function ResumeTemplate({ data }: ResumeTemplateProps) {
  const template = getTemplate(data.style?.templateId);
  const Template = template.Pdf;
  return <Template data={data} />;
}
