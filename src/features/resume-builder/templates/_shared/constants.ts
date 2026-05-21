import type { ResumeDensity, ResumeFontFamily, ResumePaperSize } from "@/types/resume";

/**
 * Page geometry — TWO coordinate systems matter:
 *
 *  1. PT (point) dimensions — what react-pdf uses internally to lay out the
 *     PDF. The HTML preview content layer is rendered at these dimensions in
 *     CSS pixels (so 1px-in-content == 1pt-in-PDF) and then visually scaled
 *     up by `PT_TO_PX` so the on-screen page shows at the proper A4 size.
 *     This is the trick that makes text reflow & spacing identical between
 *     the preview and the downloaded PDF.
 *
 *  2. PX (visual) dimensions — what the user sees on screen. A4 at 96 DPI
 *     is 794×1123 px (= PT × 4/3).
 */

/** Conversion factor from PDF points to CSS pixels at 96 DPI. */
export const PT_TO_PX = 96 / 72; // 1.3333…

/** Page dimensions in PDF points (= layout space inside the content layer). */
export const PAGE_DIMENSIONS_PT: Record<
  ResumePaperSize,
  { width: number; height: number }
> = {
  A4: { width: 595, height: 842 },
  letter: { width: 612, height: 792 },
};

/**
 * Visual page dimensions in CSS pixels at 96 DPI. These are the size the
 * page <div> takes on screen — derived from the PT dimensions × PT_TO_PX.
 */
export const PAGE_DIMENSIONS: Record<
  ResumePaperSize,
  { width: number; height: number }
> = {
  A4: {
    width: Math.round(PAGE_DIMENSIONS_PT.A4.width * PT_TO_PX),
    height: Math.round(PAGE_DIMENSIONS_PT.A4.height * PT_TO_PX),
  },
  letter: {
    width: Math.round(PAGE_DIMENSIONS_PT.letter.width * PT_TO_PX),
    height: Math.round(PAGE_DIMENSIONS_PT.letter.height * PT_TO_PX),
  },
};

/**
 * Page padding (in PT, which equals px inside the content layer) — matches
 * the `padding: 50` in `pdf-base-styles.ts`. Total reserved vertical space
 * is `PAGE_PADDING_PT * 2`.
 */
export const PAGE_PADDING_PT = 50;

/** Font label → Tailwind class for the HTML preview. */
export const FONT_CLASS_MAP: Record<ResumeFontFamily | string, string> = {
  Inter: "font-resume-inter",
  Roboto: "font-resume-roboto",
  Garamond: "font-resume-garamond",
};

/**
 * Resolves a stored fontFamily to a font name @react-pdf knows about.
 * Old names (Helvetica/Calibri/Times/Georgia) are mapped to the closest
 * supported Google Font so legacy resumes don't break.
 */
const PDF_FONT_ALIASES: Record<string, ResumeFontFamily> = {
  Helvetica: "Inter",
  Calibri: "Inter",
  "Times New Roman": "Garamond",
  Georgia: "Garamond",
};

const VALID_PDF_FONTS: ResumeFontFamily[] = [
  "Inter",
  "Roboto",
  "Garamond",
];

export function resolvePdfFont(fontFamily?: string): ResumeFontFamily {
  if (!fontFamily) return "Inter";
  const aliased = PDF_FONT_ALIASES[fontFamily] ?? fontFamily;
  return VALID_PDF_FONTS.includes(aliased as ResumeFontFamily)
    ? (aliased as ResumeFontFamily)
    : "Inter";
}

/** Tailwind class for each line-height keyword in the HTML preview. */
export const LINE_HEIGHT_CLASS_MAP: Record<string, string> = {
  tight: "leading-tight",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
};

/** Numeric line-height for `@react-pdf` styles. */
export const LINE_HEIGHT_NUMERIC: Record<string, number> = {
  tight: 1.15,
  normal: 1.35,
  relaxed: 1.55,
};

/**
 * Density → Tailwind spacing classes for section gaps and item margins.
 * Applied by templates to control how "packed" the resume feels.
 */
export const DENSITY_CLASSES: Record<
  ResumeDensity,
  { sectionGap: string; itemGap: string; sectionMt: string }
> = {
  compact: { sectionGap: "mb-2", itemGap: "mb-1.5", sectionMt: "mt-3" },
  normal: { sectionGap: "mb-4", itemGap: "mb-3", sectionMt: "mt-5" },
  comfortable: { sectionGap: "mb-6", itemGap: "mb-4", sectionMt: "mt-7" },
};

/** Strips http(s)://, www. and trailing slash for compact URL display. */
export function cleanUrl(url: string | null | undefined): string {
  if (!url) return "";
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

/**
 * Parses a Tailwind size token like "text-[11px]" → 11.
 * Falls back to 11 when the input is malformed.
 */
export function parseFontSize(token: string | undefined): number {
  if (!token) return 11;
  const match = token.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 11;
}
