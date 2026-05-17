import type { TemplateDefinition } from "../types";

import { ClassicHtmlTemplate } from "./html-template";
import { ClassicPdfTemplate } from "./pdf-template";

export const classicTemplate: TemplateDefinition = {
  id: "classic",
  label: "Classic",
  description:
    "Header rapat dengan double border, judul section uppercase. Formal & tradisional.",
  Html: ClassicHtmlTemplate,
  Pdf: ClassicPdfTemplate,
};
