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

import { cleanUrl } from "../_shared/constants";
import {
  buildBasePdfStyles,
  PDF_BASE_COLORS,
} from "../_shared/pdf-base-styles";
import { renderPdfSections, renderPdfSummary } from "../_shared/pdf-engine";
import { resolveTranslations } from "../_shared/translations";
import type { PdfTemplateProps } from "../types";

/**
 * Classic PDF template — centered header inside a double border, uppercase
 * nameplate, section titles bordered top + bottom in uppercase. Mirrors the
 * Classic HTML preview.
 */
export function ClassicPdfTemplate({ data }: PdfTemplateProps) {
  const { personalInfo, style } = data;
  const translations = resolveTranslations(style?.language);
  const paperSize = style?.paperSize || "A4";

  const baseStyles = buildBasePdfStyles(style);
  const styles = StyleSheet.create({
    ...baseStyles,
    header: {
      ...baseStyles.header,
      marginBottom: 12,
      paddingBottom: 8,
      paddingTop: 8,
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: PDF_BASE_COLORS.primary,
      borderTopWidth: 1,
      borderTopColor: PDF_BASE_COLORS.primary,
    },
    name: {
      ...baseStyles.name,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    sectionTitle: {
      ...baseStyles.sectionTitle,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: PDF_BASE_COLORS.border,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet.create has narrow inferred types
  } as any) as any;

  const pdfPageSize = paperSize === "letter" ? "LETTER" : "A4";

  return (
    <Document>
      <Page size={pdfPageSize} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={
              personalInfo.photoUrl
                ? {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20,
                    marginBottom: 10,
                  }
                : {}
            }
          >
            {personalInfo.photoUrl && (
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            )}
            <View
              style={
                personalInfo.photoUrl
                  ? { alignItems: "flex-start", textAlign: "left" }
                  : {}
              }
            >
              <Text style={styles.name}>
                {personalInfo.fullName || "NAMA LENGKAP"}
              </Text>
              {personalInfo.title && (
                <Text style={styles.jobTitle}>{personalInfo.title}</Text>
              )}
            </View>
          </View>
          <View style={styles.contactInfo}>
            <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                src={`mailto:${personalInfo.email}`}
              >
                {personalInfo.email}
              </Link>
              {personalInfo.phone && (
                <>
                  <Text style={{ marginHorizontal: 4 }}>•</Text>
                  <Link src={`tel:${personalInfo.phone}`}>
                    {personalInfo.phone}
                  </Link>
                </>
              )}
              {personalInfo.location && (
                <>
                  <Text style={{ marginHorizontal: 4 }}>•</Text>
                  <Text>{personalInfo.location}</Text>
                </>
              )}
            </View>
          </View>
          {(personalInfo.website?.url || personalInfo.linkedin?.url) && (
            <View style={{ ...styles.contactInfo, flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
              {personalInfo.website?.url && (
                <Link src={personalInfo.website.url}>
                  {personalInfo.website.label ||
                    cleanUrl(personalInfo.website.url)}
                </Link>
              )}
              {personalInfo.website?.url && personalInfo.linkedin?.url && (
                <Text style={{ marginHorizontal: 4 }}>•</Text>
              )}
              {personalInfo.linkedin?.url && (
                <Link src={personalInfo.linkedin.url}>
                  {personalInfo.linkedin.label ||
                    cleanUrl(personalInfo.linkedin.url)}
                </Link>
              )}
            </View>
          )}
        </View>

        {renderPdfSummary(personalInfo.summary, translations, styles)}
        {renderPdfSections({ data, translations, styles })}
      </Page>
    </Document>
  );
}
