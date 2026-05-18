import type { ComponentType } from "react";

import type { CoverLetterTemplateId } from "@/types/cover-letter";
import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

/** Props passed to every template's HTML preview component. */
export interface HtmlTemplateProps {
  data: Partial<CoverLetterBuilderData>;
}

/** Props passed to every template's PDF renderer. */
export interface PdfTemplateProps {
  data: Partial<CoverLetterBuilderData>;
}

/**
 * Static metadata + component handles describing a single cover letter template.
 */
export interface TemplateDefinition {
  id: CoverLetterTemplateId;
  /** Human-readable name shown in the visual settings panel. */
  label: string;
  /** Short description of the template's visual character. */
  description: string;
  /** HTML preview component (renders inside the editor). */
  Html: ComponentType<HtmlTemplateProps>;
  /** PDF renderer component (used by `@react-pdf/renderer` to export). */
  Pdf: ComponentType<PdfTemplateProps>;
}
