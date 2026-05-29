import type { CoverLetterTemplateId } from "@/types/cover-letter";

import { classicTemplate } from "./classic";
import { modernTemplate } from "./modern";
import { formalTemplate } from "./formal";
import type { TemplateDefinition } from "./types";

/**
 * Registry of every available cover letter template.
 * To add a new one: create `templates/{id}.tsx` exporting a component and a
 * `TemplateDefinition`, then add it here.
 */
export const TEMPLATES: Record<string, TemplateDefinition> = {
  classic: classicTemplate,
  modern: modernTemplate,
  formal: formalTemplate,
};

export const TEMPLATE_LIST: TemplateDefinition[] = [
  classicTemplate,
  modernTemplate,
  formalTemplate,
];

export function getTemplate(
  id?: CoverLetterTemplateId | string,
): TemplateDefinition {
  if (id && TEMPLATES[id]) return TEMPLATES[id];
  return classicTemplate;
}
