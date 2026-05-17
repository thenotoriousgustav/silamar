"use client";

import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import "../_shared/pdf-fonts";

import { cleanUrl, parseFontSize, resolvePdfFont } from "../_shared/constants";
import {
  buildBasePdfStyles,
  PDF_BASE_COLORS,
} from "../_shared/pdf-base-styles";
import { renderPdfSections, renderPdfSummary } from "../_shared/pdf-engine";
import { resolveTranslations } from "../_shared/translations";
import type { PdfTemplateProps } from "../types";

/**
 * Minimal PDF template — left-aligned, no decorative borders, tracked-out
 * uppercase job title, slim left-accent on section titles.
 */
export function MinimalPdfTemplate({ data }: PdfTemplateProps) {
  const { personalInfo, style } = data;
  const translations = resolveTranslations(style?.language);
  const paperSize = style?.paperSize || "A4";
  const baseFontSize = parseFontSize(style?.fontSize);
  const fontFamily = resolvePdfFont(style?.fontFamily);

  const baseStyles = buildBasePdfStyles(style);
  const styles = StyleSheet.create({
    ...baseStyles,
    page: { ...baseStyles.page, padding: 55 },
    header: {
      ...baseStyles.header,
      marginBottom: 24,
      textAlign: "left",
      alignItems: "flex-start",
    },
    name: {
      ...baseStyles.name,
      fontSize: baseFontSize + 12,
      textTransform: "none",
      letterSpacing: 0,
      marginBottom: 2,
      textAlign: "left",
      // Light feel via regular-weight font (boldFont still bold for headings).
      fontFamily,
      fontWeight: 400,
    },
    jobTitle: {
      ...baseStyles.jobTitle,
      textAlign: "left",
      fontSize: baseFontSize - 1,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: PDF_BASE_COLORS.muted,
    },
    contactInfo: {
      ...baseStyles.contactInfo,
      textAlign: "left",
      color: PDF_BASE_COLORS.muted,
    },
    sectionTitle: {
      ...baseStyles.sectionTitle,
      borderLeftWidth: 2,
      borderLeftColor: PDF_BASE_COLORS.muted,
      paddingLeft: 8,
      paddingTop: 0,
      paddingBottom: 0,
      textTransform: "none",
      fontSize: baseFontSize + 1,
      letterSpacing: 0,
      marginBottom: 10,
      marginTop: 4,
      color: PDF_BASE_COLORS.secondary,
    },
    experienceTitle: {
      ...baseStyles.experienceTitle,
      fontSize: baseFontSize,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet.create has narrow inferred types
  } as any) as any;

  const pdfPageSize = paperSize === "letter" ? "LETTER" : "A4";

  return (
    <Document>
      <Page size={pdfPageSize} style={styles.page}>
        {/* Minimal left-aligned header */}
        <View style={styles.header}>
          <View
            style={
              personalInfo.photoUrl
                ? {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    marginBottom: 10,
                  }
                : {}
            }
          >
            {personalInfo.photoUrl && (
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            )}
            <View>
              <Text style={styles.name}>
                {personalInfo.fullName || "NAMA LENGKAP"}
              </Text>
              {personalInfo.title && (
                <Text style={styles.jobTitle}>{personalInfo.title}</Text>
              )}
            </View>
          </View>
          <View style={styles.contactInfo}>
            <View style={{ flexDirection: "row" }}>
              <Link
                src={`mailto:${personalInfo.email}`}
                style={{ marginRight: 6 }}
              >
                {personalInfo.email}
              </Link>
              {personalInfo.phone && (
                <Link
                  src={`tel:${personalInfo.phone}`}
                  style={{ marginRight: 6 }}
                >
                  {personalInfo.phone}
                </Link>
              )}
              {personalInfo.location && (
                <Text style={{ marginRight: 6 }}>{personalInfo.location}</Text>
              )}
              {personalInfo.website?.url && (
                <Link src={personalInfo.website.url}>
                  {personalInfo.website.label ||
                    cleanUrl(personalInfo.website.url)}
                </Link>
              )}
            </View>
          </View>
          {personalInfo.linkedin?.url && (
            <Link src={personalInfo.linkedin.url} style={styles.contactInfo}>
              {personalInfo.linkedin.label ||
                cleanUrl(personalInfo.linkedin.url)}
            </Link>
          )}
        </View>

        {renderPdfSummary(personalInfo.summary, translations, styles)}
        {renderPdfSections({ data, translations, styles })}
      </Page>
    </Document>
  );
}
