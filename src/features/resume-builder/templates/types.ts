import type { ComponentType } from "react";

import type { ResumeContent, ResumeTemplateId } from "@/types/resume";

/** Props passed to every template's PDF renderer. */
export interface PdfTemplateProps {
  data: ResumeContent;
}

/**
 * Static metadata + component handle describing a single resume template.
 * Adding a new template: implement the PDF component and register in `registry.ts`.
 */
export interface TemplateDefinition {
  id: ResumeTemplateId;
  /** Human-readable name shown in the visual settings panel. */
  label: string;
  /** Short description of the template's visual character. */
  description: string;
  /** PDF renderer component (used by `@react-pdf/renderer` to export). */
  Pdf: ComponentType<PdfTemplateProps>;
}
