import { ModernHtmlTemplate } from "./html-template";
import { ModernPdfTemplate } from "./pdf-template";
import type { TemplateDefinition } from "../types";

export const modernTemplate: TemplateDefinition = {
  id: "modern",
  label: "Modern",
  description: "A fresh and dynamic centered cover letter template.",
  Html: ModernHtmlTemplate,
  Pdf: ModernPdfTemplate,
};
