"use client";

import { Text, View } from "@react-pdf/renderer";

import { isLexicalJson, lexicalJsonToTextLines } from "@/lib/lexical-to-html";
import type { DescriptionItem } from "@/types/resume";

interface PdfBulletListProps {
  items: DescriptionItem[] | string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any;
}

/**
 * Renders a bullet list for PDF.
 * Accepts Lexical JSON (from rich text editor) or DescriptionItem[] (from PDF import).
 */
export function PdfBulletList({ items, styles }: PdfBulletListProps) {
  if (!items) return null;

  let bulletArray: string[];

  if (typeof items === "string") {
    if (!isLexicalJson(items)) return null;
    bulletArray = lexicalJsonToTextLines(items).filter(Boolean);
  } else {
    if (items.length === 0) return null;
    bulletArray = items.map((item) => item.text);
  }

  if (bulletArray.length === 0) return null;

  return (
    <View style={styles.bulletList}>
      {bulletArray.map((item, i) => (
        <View key={i} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
