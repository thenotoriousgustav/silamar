import type { ResumeStyle } from "@/types/resume";

import {
  LINE_HEIGHT_NUMERIC,
  parseFontSize,
  resolvePdfFont,
} from "./constants";

/**
 * Color palette used by the base styles. Templates can override individual
 * colors by spreading their own color object on top.
 */
export const PDF_BASE_COLORS = {
  primary: "#000000",
  secondary: "#000000",
  muted: "#000000",
  border: "#000000",
  accent: "#2563eb",
  link: "#2563eb",
};

export type PdfStyleSheet = Record<string, Record<string, unknown>>;

/**
 * Returns the baseline @react-pdf style object every template starts from.
 * Each template imports this and then spreads its own overrides on top.
 *
 * The returned object is intentionally NOT wrapped in `StyleSheet.create()`
 * — templates may need to mutate values before flattening, so they call
 * `StyleSheet.create()` themselves at the end.
 */
export function buildBasePdfStyles(style?: ResumeStyle): PdfStyleSheet {
  const fontFamily = resolvePdfFont(style?.fontFamily);
  const baseFontSize = parseFontSize(style?.fontSize);
  const lineHeight =
    LINE_HEIGHT_NUMERIC[style?.lineHeight ?? "relaxed"] ?? 1.55;
  const colors = PDF_BASE_COLORS;

  // Bold variants reuse the same family — Google Fonts Inter/Roboto/Lato/
  // Garamond all ship a 700 weight, so @react-pdf picks it up automatically
  // when fontWeight is set on a Text.
  const boldFont = fontFamily;

  return {
    page: {
      padding: 50,
      fontSize: baseFontSize,
      fontFamily,
      color: colors.primary,
      lineHeight,
    },
    header: {
      marginBottom: 12,
    },
    headerContentLeft: { flex: 1 },
    headerContentRight: { textAlign: "right" },
    name: {
      fontSize: baseFontSize + 8,
      fontFamily: boldFont,
      fontWeight: 700,
      marginBottom: 10,
    },
    jobTitle: {
      fontSize: baseFontSize,
      color: colors.secondary,
      marginBottom: 6,
    },
    contactInfo: {
      fontSize: baseFontSize - 2,
      color: colors.link,
      marginBottom: 2,
    },
    contactSeparator: { marginHorizontal: 6 },
    section: { marginBottom: 12 },
    sectionTitle: {
      fontSize: baseFontSize,
      fontFamily: boldFont,
      fontWeight: 700,
      marginTop: 14,
      marginBottom: 6,
    },
    summary: {
      fontSize: baseFontSize - 1,
      color: colors.primary,
      lineHeight,
      textAlign: "justify",
    },
    experienceItem: { marginBottom: 10 },
    experienceHeader: { marginBottom: 2 },
    experienceTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    experienceTitle: {
      fontSize: baseFontSize - 1,
      fontFamily: boldFont,
      fontWeight: 700,
    },
    experienceDate: {
      fontSize: baseFontSize - 2,
      color: colors.muted,
    },
    experienceCompanyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    experienceCompany: {
      fontSize: baseFontSize - 1,
      fontFamily,
      color: colors.secondary,
    },
    experienceLocation: {
      fontSize: baseFontSize - 2,
      color: colors.muted,
    },
    bulletList: { marginTop: 4 },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      paddingLeft: 8,
    },
    bullet: { width: 12, fontSize: baseFontSize - 1 },
    bulletText: {
      flex: 1,
      fontSize: baseFontSize - 2,
      lineHeight,
      textAlign: "justify",
    },
    educationItem: { marginBottom: 8 },
    educationDegree: {
      fontSize: baseFontSize - 1,
      fontFamily: boldFont,
      fontWeight: 700,
    },
    educationSchool: {
      fontSize: baseFontSize - 1,
      fontFamily,
      color: colors.secondary,
    },
    educationDetails: {
      fontSize: baseFontSize - 2,
      color: colors.muted,
    },
    skillsText: { fontSize: baseFontSize - 2, lineHeight },
    skillCategory: { marginBottom: 4 },
    skillCategoryName: {
      fontFamily: boldFont,
      fontWeight: 700,
      fontSize: baseFontSize - 2,
    },
    projectItem: { marginBottom: 8 },
    projectName: {
      fontSize: baseFontSize - 1,
      fontFamily: boldFont,
      fontWeight: 700,
    },
    projectUrl: { fontSize: baseFontSize - 3, color: colors.link },
    projectDescription: {
      fontSize: baseFontSize - 2,
      color: colors.secondary,
      marginTop: 2,
    },
    certItem: { marginBottom: 4 },
    certName: {
      fontSize: baseFontSize - 2,
      fontFamily: boldFont,
      fontWeight: 700,
    },
    certDetails: { fontSize: baseFontSize - 3, color: colors.muted },
    inlineList: { fontSize: baseFontSize - 2, lineHeight },
    photo: {
      width: 70,
      height: 70,
      borderRadius: 35,
      objectFit: "cover",
      borderWidth: 1,
      borderColor: colors.border,
    },
    modernPhoto: {
      width: 60,
      height: 60,
      borderRadius: 30,
      objectFit: "cover",
      borderWidth: 2,
      borderColor: colors.accent,
      marginBottom: 5,
    },
    headerWithPhoto: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      marginBottom: 10,
    },
  };
}
