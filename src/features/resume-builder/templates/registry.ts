import type { ResumeTemplateId } from "@/types/resume";

import { classicTemplate } from "./classic";
import { harvardTemplate } from "./harvard";
import { oxfordTemplate } from "./oxford";
import type { TemplateDefinition } from "./types";

/**
 * Registry of every available resume template.
 * To add a new one: create `templates/{id}.tsx` exporting a component and
 * a `TemplateDefinition`, then add it here.
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

export function getTemplate(id?: ResumeTemplateId | string): TemplateDefinition {
  if (id && TEMPLATES[id]) return TEMPLATES[id];
  return classicTemplate;
}
