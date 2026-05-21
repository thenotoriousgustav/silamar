"use client";

import { Text, View } from "@react-pdf/renderer";

import { isLexicalJson } from "@/lib/lexical-to-html";

import { LexicalRichText } from "./pdf-rich-text";
import type { ResumeTranslations } from "./translations";

interface PdfSummaryProps {
  summary: string | undefined;
  translations: ResumeTranslations;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any;
}

/**
 * Renders the "Professional Summary" section for PDF.
 *
 * When the summary is Lexical JSON (from the rich text editor), it uses
 * LexicalRichText to preserve inline formatting — bold, italic, underline,
 * strikethrough. Plain text is rendered as-is.
 */
export function PdfSummary({ summary, translations, styles }: PdfSummaryProps) {
  if (!summary) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {translations.professionalSummary}
      </Text>
      {isLexicalJson(summary) ? (
        <LexicalRichText value={summary} style={styles.summary} />
      ) : (
        <Text style={styles.summary}>{summary}</Text>
      )}
    </View>
  );
}
