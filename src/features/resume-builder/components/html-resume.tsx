"use client";

import type { ResumeContent } from "@/types/resume";

import { getTemplate } from "../templates/registry";

interface HtmlResumeProps {
  data: ResumeContent;
  onJumpToSection?: (sectionId: string) => void;
}

// Re-exported for consumers that depend on the page geometry (preview
// container, highlighted preview overlay, etc.).
export { PAGE_DIMENSIONS } from "../templates/_shared/constants";

/**
 * Top-level HTML preview entrypoint. Looks up the active template from the
 * registry and delegates rendering. The heavy lifting (header layout,
 * pagination, body sections) lives inside each template + the shared engine
 * under `templates/_shared/`.
 */
export function HtmlResume({ data, onJumpToSection }: HtmlResumeProps) {
  const template = getTemplate(data.style?.templateId);
  const Template = template.Html;
  return <Template data={data} onJumpToSection={onJumpToSection} />;
}
