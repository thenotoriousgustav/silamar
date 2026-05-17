import type { TemplateDefinition } from "../types";

import { OxfordHtmlTemplate } from "./html-template";
import { OxfordPdfTemplate } from "./pdf-template";

export const oxfordTemplate: TemplateDefinition = {
  id: "oxford",
  label: "Oxford",
  description:
    "Nama biru terpusat, section title uppercase bergaris bawah, info item dalam satu baris bold. Gaya akademis Oxford.",
  Html: OxfordHtmlTemplate,
  Pdf: OxfordPdfTemplate,
};
