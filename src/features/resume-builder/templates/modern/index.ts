import type { TemplateDefinition } from "../types";

import { ModernHtmlTemplate } from "./html-template";
import { ModernPdfTemplate } from "./pdf-template";

export const modernTemplate: TemplateDefinition = {
  id: "modern",
  label: "Modern",
  description:
    "Aksen biru, header dua kolom, judul section block tinted. Kontemporer & korporat.",
  Html: ModernHtmlTemplate,
  Pdf: ModernPdfTemplate,
};
