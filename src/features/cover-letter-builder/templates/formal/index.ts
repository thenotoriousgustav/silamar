import { FormalHtmlTemplate } from "./html-template";
import { FormalPdfTemplate } from "./pdf-template";
import type { TemplateDefinition } from "../types";

export const formalTemplate: TemplateDefinition = {
  id: "formal",
  label: "Formal",
  description: "A strictly professional and structured cover letter template.",
  Html: FormalHtmlTemplate,
  Pdf: FormalPdfTemplate,
};
