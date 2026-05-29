import type { ComponentType } from "react";

import type { CoverLetterTemplateId } from "@/types/cover-letter";
import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

/** Props passed to every template's PDF renderer. */
export interface PdfTemplateProps {
  data: Partial<CoverLetterBuilderData>;
}

/**
 * Static metadata + component handle describing a single cover letter template.
 * Adding a new template: implement the PDF component and register in `registry.ts`.
 */
export interface TemplateDefinition {
  id: CoverLetterTemplateId;
  /** Human-readable name shown in the visual settings panel. */
  label: string;
  /** Short description of the template's visual character. */
  description: string;
  /** PDF renderer component (used by `@react-pdf/renderer` to export). */
  Pdf: ComponentType<PdfTemplateProps>;
}
