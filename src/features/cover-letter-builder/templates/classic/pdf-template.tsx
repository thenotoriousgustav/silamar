import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import "../../resume-builder-fonts";
import { renderPdfContent } from "../../utils/pdf-content-renderer";
import { resolveCoverLetterPdfStyle } from "../../utils/pdf-styles";
import type { PdfTemplateProps } from "../types";

export function ClassicPdfTemplate({ data }: PdfTemplateProps) {
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
    header: { marginBottom: 30, textAlign: "right" },
    senderName: {
      fontSize: fontSize * 1.7,
      fontWeight: "bold",
      marginBottom: 5,
      textTransform: "uppercase",
    },
    senderInfo: {
      fontSize: fontSize * 0.85,
      color: "#4b5563",
      lineHeight: 1.4,
    },
    date: { fontSize: fontSize * 0.85, color: "#4b5563", marginBottom: 15 },
    recipientSection: { marginBottom: 20 },
    recipientName: { fontSize, fontWeight: "bold", marginBottom: 2 },
    recipientInfo: {
      fontSize: fontSize * 0.85,
      color: "#4b5563",
      lineHeight: 1.4,
    },
    subject: {
      fontSize,
      fontWeight: "bold",
      textTransform: uppercaseHeaders ? "uppercase" : "none",
      marginBottom: 20,
    },
    content: { fontSize, color: "#1f2937", textAlign: "justify", lineHeight },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any) as any;

  const today = new Date().toLocaleDateString(
    data.style?.language === "en" ? "en-US" : "id-ID",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const subjectLabel = data.style?.language === "en" ? "Subject" : "Perihal";

  return (
    <Document>
      <Page size={paperSize as "A4" | "LETTER"} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.senderName}>{data.fullName || "NAMA ANDA"}</Text>
          <View style={styles.senderInfo}>
            {data.address && <Text>{data.address}</Text>}
            {data.cityAndPostal && <Text>{data.cityAndPostal}</Text>}
            {data.email && <Text>{data.email}</Text>}
            {data.phone && <Text>{data.phone}</Text>}
          </View>
        </View>

        <Text style={styles.date}>{today}</Text>
        <View style={styles.recipientSection}>
          <Text style={styles.recipientName}>
            {data.recipientName || "Nama Penerima"}
          </Text>
          <View style={styles.recipientInfo}>
            {data.department && <Text>{data.department}</Text>}
            {data.companyName && <Text>{data.companyName}</Text>}
            {data.recipientAddress && <Text>{data.recipientAddress}</Text>}
            {data.recipientCityAndPostal && (
              <Text>{data.recipientCityAndPostal}</Text>
            )}
          </View>
        </View>

        {data.subject && (
          <Text style={styles.subject}>
            {subjectLabel}: {data.subject}
          </Text>
        )}

        {renderPdfContent(data.content, styles.content)}
      </Page>
    </Document>
  );
}
