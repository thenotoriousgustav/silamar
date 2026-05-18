import type { ResumeTemplateId } from "@/types/resume";

import { classicTemplate } from "./classic";
import { harvardTemplate } from "./harvard";
import { oxfordTemplate } from "./oxford";
import type { TemplateDefinition } from "./types";

/**
 * Registry of every available resume template. To add a new one:
 *   1. Create a folder under `templates/{id}/` with `html-template.tsx`,
 *      `pdf-template.tsx`, and `index.ts` exporting a `TemplateDefinition`.
 *   2. Add an entry below.
 *   3. (Optional) Extend `RESUME_TEMPLATE_IDS` in `src/types/resume.ts` if
 *      you're introducing a brand-new id.
 */
export const TEMPLATES: Record<string, TemplateDefinition> = {
  classic: classicTemplate,
  harvard: harvardTemplate,
  oxford: oxfordTemplate,
};

/** Ordered list — drives the visual settings panel order. */
export const TEMPLATE_LIST: TemplateDefinition[] = [
  classicTemplate,
  harvardTemplate,
  oxfordTemplate,
];

/**
 * Returns the registered template, or falls back to "classic" when an
 * unknown id is requested (e.g. legacy data referring to a removed template).
 */
export function getTemplate(id?: ResumeTemplateId | string): TemplateDefinition {
  if (id && TEMPLATES[id]) return TEMPLATES[id];
  return classicTemplate;
}
