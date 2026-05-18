import { ClassicHtmlTemplate } from "./html-template";
import { ClassicPdfTemplate } from "./pdf-template";
import type { TemplateDefinition } from "../types";

export const classicTemplate: TemplateDefinition = {
  id: "classic",
  label: "Classic",
  description: "A clean and professional traditional cover letter template.",
  Html: ClassicHtmlTemplate,
  Pdf: ClassicPdfTemplate,
};
