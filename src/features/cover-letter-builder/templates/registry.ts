import type { CoverLetterTemplateId } from "@/types/cover-letter";

import { classicTemplate } from "./classic";
import { modernTemplate } from "./modern";
import { formalTemplate } from "./formal";
import type { TemplateDefinition } from "./types";

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

export function getTemplate(id?: CoverLetterTemplateId | string): TemplateDefinition {
  if (id && TEMPLATES[id]) return TEMPLATES[id];
  return classicTemplate;
}
