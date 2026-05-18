"use client";

import { Text, View } from "@react-pdf/renderer";

import { isLexicalJson, lexicalJsonToTextLines } from "@/lib/lexical-to-html";

import type { ResumeTranslations } from "./translations";

interface PdfSummaryProps {
  summary: string | undefined;
  translations: ResumeTranslations;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet is loose
  styles: any;
}

/**
 * Renders the "Professional Summary" section for PDF.
 * Accepts plain text or Lexical-serialized JSON (from the rich text editor)
 * and converts JSON to plain text lines so it doesn't leak as raw JSON into
 * the rendered PDF.
 */
export function PdfSummary({ summary, translations, styles }: PdfSummaryProps) {
  if (!summary) return null;

  // Lexical JSON → split into block-level lines
  const lines = isLexicalJson(summary)
    ? lexicalJsonToTextLines(summary)
    : [summary];

  if (lines.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{translations.professionalSummary}</Text>
      {lines.map((line, idx) => (
        <Text key={idx} style={styles.summary}>
          {line}
        </Text>
      ))}
    </View>
  );
}
