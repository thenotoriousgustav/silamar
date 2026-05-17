import type { ResumeFontFamily, ResumePaperSize } from "@/types/resume";

/**
 * Page geometry expressed in CSS pixels at 96 DPI for the HTML preview.
 *  - A4: 210mm × 297mm
 *  - US Letter: 8.5" × 11"
 */
export const PAGE_DIMENSIONS: Record<
  ResumePaperSize,
  { width: number; height: number }
> = {
  A4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
};

/** Total vertical padding (top + bottom) reserved on each rendered page. */
export const PAGE_PADDING = 100;

/** Font label → Tailwind class for the HTML preview. */
export const FONT_CLASS_MAP: Record<ResumeFontFamily | string, string> = {
  Inter: "font-resume-inter",
  Roboto: "font-resume-roboto",
  Lato: "font-resume-lato",
  Garamond: "font-resume-garamond",
  // Backward compatibility for resumes saved with old font names.
  Helvetica: "font-resume-inter",
  Calibri: "font-resume-inter",
  Georgia: "font-resume-garamond",
  "Times New Roman": "font-resume-garamond",
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
  "Lato",
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
