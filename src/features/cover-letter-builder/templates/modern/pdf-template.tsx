import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import "../../resume-builder-fonts";
import { renderPdfContent } from "../../utils/pdf-content-renderer";
import { resolveCoverLetterPdfStyle } from "../../utils/pdf-styles";
import type { PdfTemplateProps } from "../types";

export function ModernPdfTemplate({ data }: PdfTemplateProps) {
  const { fontSize, lineHeight, fontFamily, paperSize, uppercaseHeaders } =
    resolveCoverLetterPdfStyle(data.style);

  const styles = StyleSheet.create({
    page: {
      padding: 50,
      fontSize,
      fontFamily,
      color: "#000000",
      lineHeight,
    },
    header: { marginBottom: 40, textAlign: "center" },
    senderName: {
      fontSize: fontSize * 2.2,
      fontWeight: "bold",
      color: "#2563eb",
      marginBottom: 5,
      textTransform: "uppercase",
    },
    senderInfo: {
      fontSize: fontSize * 0.8,
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    recipientRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 30,
    },
    recipientLabel: {
      fontSize,
      fontWeight: "bold",
      marginBottom: 2,
      color: "#111827",
    },
    recipientName: { fontSize, fontWeight: "bold", color: "#111827" },
    recipientInfo: { fontSize, color: "#4b5563" },
    companyName: { fontSize, color: "#2563eb", fontWeight: "bold" },
    date: { fontSize: fontSize * 0.85, color: "#6b7280" },
    subjectContainer: {
      backgroundColor: "#eff6ff",
      padding: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#2563eb",
      marginBottom: 25,
    },
    subject: {
      fontSize,
      fontWeight: "bold",
      color: "#1e3a8a",
      textTransform: uppercaseHeaders ? "uppercase" : "none",
    },
    content: { fontSize, color: "#1f2937", textAlign: "justify", lineHeight },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any) as any;

  const today = new Date().toLocaleDateString(
    data.style?.language === "en" ? "en-US" : "id-ID",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const recipientLabel = data.style?.language === "en" ? "TO:" : "UNTUK:";

  return (
    <Document>
      <Page size={paperSize as "A4" | "LETTER"} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.senderName}>{data.fullName || "NAMA ANDA"}</Text>
          <Text style={styles.senderInfo}>
            {[data.address, data.cityAndPostal, data.email, data.phone]
              .filter(Boolean)
              .join("  •  ")}
          </Text>
        </View>

        <View style={styles.recipientRow}>
          <View>
            <Text style={styles.recipientLabel}>{recipientLabel}</Text>
            <Text style={styles.recipientName}>
              {data.recipientName || "Nama Penerima"}
            </Text>
            {data.department && (
              <Text style={styles.recipientInfo}>{data.department}</Text>
            )}
            {data.companyName && (
              <Text style={styles.companyName}>{data.companyName}</Text>
            )}
            {data.recipientAddress && (
              <Text style={styles.recipientInfo}>{data.recipientAddress}</Text>
            )}
            {data.recipientCityAndPostal && (
              <Text style={styles.recipientInfo}>
                {data.recipientCityAndPostal}
              </Text>
            )}
          </View>
          <Text style={styles.date}>{today}</Text>
        </View>

        {data.subject && (
          <View style={styles.subjectContainer}>
            <Text style={styles.subject}>{data.subject}</Text>
          </View>
        )}

        {renderPdfContent(data.content, styles.content)}
      </Page>
    </Document>
  );
}
