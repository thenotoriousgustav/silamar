import type { TemplateDefinition } from "../types";

import { MinimalHtmlTemplate } from "./html-template";
import { MinimalPdfTemplate } from "./pdf-template";

export const minimalTemplate: TemplateDefinition = {
  id: "minimal",
  label: "Minimal",
  description:
    "Rata kiri, lowercase, banyak ruang kosong, garis aksen tipis. Editorial & elegan.",
  Html: MinimalHtmlTemplate,
  Pdf: MinimalPdfTemplate,
};
