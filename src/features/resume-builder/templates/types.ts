/**
 * Shared types for the resume template system.
 *
 * Each template registers itself in `registry.ts` by exporting a
 * `TemplateDefinition`. The HTML preview and the PDF renderer each have
 * separate component slots so layout can diverge between them when needed
 * (e.g. PDF has fixed pages but HTML preview doesn't).
 */
import type { ComponentType } from "react";

import type { ResumeContent, ResumeTemplateId } from "@/types/resume";

/** Props passed to every template's HTML preview component. */
export interface HtmlTemplateProps {
  data: ResumeContent;
  onJumpToSection?: (sectionId: string) => void;
}

/** Props passed to every template's PDF renderer. */
export interface PdfTemplateProps {
  data: ResumeContent;
}

/**
 * Static metadata + component handles describing a single resume template.
 * Adding a new template is just: implement the components and register
 * the definition in `registry.ts`.
 */
export interface TemplateDefinition {
  id: ResumeTemplateId;
  /** Human-readable name shown in the visual settings panel. */
  label: string;
  /** Short description of the template's visual character. */
  description: string;
  /** HTML preview component (renders inside the editor). */
  Html: ComponentType<HtmlTemplateProps>;
  /** PDF renderer component (used by `@react-pdf/renderer` to export). */
  Pdf: ComponentType<PdfTemplateProps>;
}
