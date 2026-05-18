export const COVER_LETTER_TEMPLATE_IDS = [
  "classic",
  "modern",
  "formal",
] as const;

export type CoverLetterTemplateId = (typeof COVER_LETTER_TEMPLATE_IDS)[number];

export const COVER_LETTER_FONT_FAMILIES = ["Inter", "Roboto", "Garamond"] as const;
export type CoverLetterFontFamily = (typeof COVER_LETTER_FONT_FAMILIES)[number];

export interface CoverLetterStyle {
  fontFamily: string;
  fontSize: string;
  lineHeight?: string;
  density?: "compact" | "normal" | "comfortable";
  uppercaseHeaders?: boolean;
  language?: "id" | "en";
  paperSize?: "A4" | "letter";
  templateId?: CoverLetterTemplateId;
}
