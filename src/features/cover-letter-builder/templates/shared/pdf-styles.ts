import type { CoverLetterBuilderData } from "../../types/cover-letter-content";

const LINE_HEIGHT_MAP: Record<string, number> = {
  tight: 1.3,
  normal: 1.5,
  relaxed: 1.7,
};

const FONT_FAMILY_MAP: Record<string, string> = {
  Inter: "Inter",
  Roboto: "Roboto",
  Garamond: "Garamond",
};

/** Spacing multiplier per density level. Applied to margins between sections. */
const DENSITY_SPACING: Record<string, { sectionGap: number; contentGap: number }> = {
  compact: { sectionGap: 15, contentGap: 4 },
  normal: { sectionGap: 25, contentGap: 6 },
  comfortable: { sectionGap: 35, contentGap: 8 },
};

/**
 * Resolves cover letter style settings into concrete values for PDF rendering.
 */
export function resolveCoverLetterPdfStyle(
  style?: CoverLetterBuilderData["style"],
) {
  const fontSize = parseInt(style?.fontSize ?? "11", 10);
  const lineHeight = LINE_HEIGHT_MAP[style?.lineHeight ?? "relaxed"] ?? 1.7;
  const fontFamily = FONT_FAMILY_MAP[style?.fontFamily ?? "Inter"] ?? "Inter";
  const paperSize = style?.paperSize === "letter" ? "LETTER" : "A4";
  const uppercaseHeaders = style?.uppercaseHeaders ?? false;
  const language = style?.language ?? "id";
  const density = DENSITY_SPACING[style?.density ?? "normal"] ?? DENSITY_SPACING.normal;

  return {
    fontSize,
    lineHeight,
    fontFamily,
    paperSize,
    uppercaseHeaders,
    language,
    /** Gap between major sections (header, recipient, subject, content) */
    sectionGap: density.sectionGap,
    /** Gap between paragraphs within content */
    contentGap: density.contentGap,
  };
}
