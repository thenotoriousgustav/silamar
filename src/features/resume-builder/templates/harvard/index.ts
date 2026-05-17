import type { TemplateDefinition } from "../types";

import { HarvardHtmlTemplate } from "./html-template";
import { HarvardPdfTemplate } from "./pdf-template";

export const harvardTemplate: TemplateDefinition = {
  id: "harvard",
  label: "Harvard",
  description:
    "Header terpusat dengan nama bold uppercase, garis tebal, judul section bergaris bawah. ATS-friendly & akademis.",
  Html: HarvardHtmlTemplate,
  Pdf: HarvardPdfTemplate,
};
