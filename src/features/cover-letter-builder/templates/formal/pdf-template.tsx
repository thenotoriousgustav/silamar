import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import "../../resume-builder-fonts";
import { renderPdfContent } from "../../utils/pdf-content-renderer";
import { resolveCoverLetterPdfStyle } from "../../utils/pdf-styles";
import type { PdfTemplateProps } from "../types";

export function FormalPdfTemplate({ data }: PdfTemplateProps) {
  const { fontSize, lineHeight, fontFamily, paperSize, uppercaseHeaders } =
    resolveCoverLetterPdfStyle(data.style);

  const styles = StyleSheet.create({
    page: {
      padding: 60,
      fontSize,
      fontFamily,
      color: "#000000",
      lineHeight,
    },
    header: {
      marginBottom: 40,
      borderBottomWidth: 1,
      borderBottomColor: "#000000",
      paddingBottom: 10,
    },
    senderName: {
      fontSize: fontSize * 1.5,
      fontWeight: "bold",
      marginBottom: 5,
      textTransform: "uppercase",
    },
    senderInfo: {
      fontSize: fontSize * 0.85,
      color: "#374151",
      lineHeight: 1.4,
    },
    date: { fontSize, marginBottom: 20 },
    recipientSection: { marginBottom: 25 },
    recipientName: { fontSize, fontWeight: "bold", marginBottom: 2 },
    recipientInfo: { fontSize, color: "#374151", lineHeight: 1.4 },
    subject: {
      fontSize,
      fontWeight: "bold",
      textTransform: uppercaseHeaders ? "uppercase" : "none",
      marginBottom: 20,
    },
    content: { fontSize, color: "#000000", textAlign: "justify", lineHeight },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any) as any;

  const today = new Date().toLocaleDateString(
    data.style?.language === "en" ? "en-US" : "id-ID",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const subjectLabel = data.style?.language === "en" ? "Subject" : "Hal";

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
