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

import { cleanUrl, parseFontSize } from "../_shared/constants";
import {
  buildBasePdfStyles,
  PDF_BASE_COLORS,
} from "../_shared/pdf-base-styles";
import { renderPdfSections, renderPdfSummary } from "../_shared/pdf-engine";
import { resolveTranslations } from "../_shared/translations";
import type { PdfTemplateProps } from "../types";

/** Modern PDF template — two-column header with accent color + tinted titles. */
export function ModernPdfTemplate({ data }: PdfTemplateProps) {
  const { personalInfo, style } = data;
  const translations = resolveTranslations(style?.language);
  const paperSize = style?.paperSize || "A4";
  const baseFontSize = parseFontSize(style?.fontSize);

  const baseStyles = buildBasePdfStyles(style);
  const styles = StyleSheet.create({
    ...baseStyles,
    header: {
      ...baseStyles.header,
      textAlign: "left",
      borderBottomWidth: 3,
      borderBottomColor: PDF_BASE_COLORS.accent,
      paddingBottom: 12,
      marginBottom: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    name: {
      ...baseStyles.name,
      fontSize: baseFontSize + 12,
      color: PDF_BASE_COLORS.accent,
      marginBottom: 4,
      letterSpacing: 0,
      textTransform: "none",
      flexShrink: 1,
    },
    jobTitle: {
      ...baseStyles.jobTitle,
      color: PDF_BASE_COLORS.accent,
      fontSize: baseFontSize + 1,
      fontWeight: 700,
    },
    contactInfo: {
      ...baseStyles.contactInfo,
      textAlign: "right",
      fontSize: baseFontSize - 3,
    },
    sectionTitle: {
      ...baseStyles.sectionTitle,
      backgroundColor: "#eff6ff",
      color: PDF_BASE_COLORS.accent,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 8,
      paddingRight: 5,
      marginBottom: 10,
      borderRadius: 2,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    experienceTitle: {
      ...baseStyles.experienceTitle,
      color: PDF_BASE_COLORS.accent,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet.create has narrow inferred types
  } as any) as any;

  const pdfPageSize = paperSize === "letter" ? "LETTER" : "A4";

  return (
    <Document>
      <Page size={pdfPageSize} style={styles.page}>
        {/* Modern split header */}
        <View style={styles.header}>
          <View style={styles.headerContentLeft}>
            <Text style={styles.name}>
              {personalInfo.fullName || "NAMA LENGKAP"}
            </Text>
            {personalInfo.title && (
              <Text style={styles.jobTitle}>{personalInfo.title}</Text>
            )}
          </View>
          <View style={styles.headerContentRight}>
            {personalInfo.photoUrl && (
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Image
                  src={personalInfo.photoUrl}
                  style={styles.modernPhoto}
                />
              </View>
            )}
            <Link
              src={`mailto:${personalInfo.email}`}
              style={styles.contactInfo}
            >
              {personalInfo.email}
            </Link>
            {personalInfo.phone && (
              <Link
                src={`tel:${personalInfo.phone}`}
                style={styles.contactInfo}
              >
                {personalInfo.phone}
              </Link>
            )}
            {(personalInfo.location || personalInfo.linkedin?.url) && (
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                {personalInfo.location && (
                  <Text style={styles.contactInfo}>
                    {personalInfo.location}
                  </Text>
                )}
                {personalInfo.location && personalInfo.linkedin?.url && (
                  <Text style={styles.contactInfo}> | </Text>
                )}
                {personalInfo.linkedin?.url && (
                  <Link
                    src={personalInfo.linkedin.url}
                    style={styles.contactInfo}
                  >
                    {personalInfo.linkedin.label ||
                      cleanUrl(personalInfo.linkedin.url)}
                  </Link>
                )}
              </View>
            )}
          </View>
        </View>

        {renderPdfSummary(personalInfo.summary, translations, styles)}
        {renderPdfSections({ data, translations, styles })}
      </Page>
    </Document>
  );
}
