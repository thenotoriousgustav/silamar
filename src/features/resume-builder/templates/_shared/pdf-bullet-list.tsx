"use client";

import { Text, View } from "@react-pdf/renderer";

import {
  htmlToTextLines,
  isLexicalJson,
  lexicalJsonToTextLines,
  looksLikeHtml,
} from "@/lib/lexical-to-html";
import type { DescriptionItem } from "@/types/resume";

interface PdfBulletListProps {
  items: DescriptionItem[] | string[] | string | undefined;
  /**
   * Style sheet from `@react-pdf/renderer` containing bulletList / bulletItem /
   * bullet / bulletText keys. Each template provides its own style object so
   * the visual treatment can vary while the parsing logic stays shared.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet is loose
  styles: any;
}

/**
 * Shared bullet list renderer for the PDF templates. Accepts the same shapes
 * as the HTML version but emits @react-pdf primitives.
 */
export function PdfBulletList({ items, styles }: PdfBulletListProps) {
  if (!items) return null;

  let bulletArray: string[];

  if (typeof items === "string") {
    if (isLexicalJson(items)) {
      bulletArray = lexicalJsonToTextLines(items).filter(Boolean);
    } else if (looksLikeHtml(items)) {
      bulletArray = htmlToTextLines(items);
    } else {
      bulletArray = items.split("\n").filter(Boolean);
    }
  } else {
    bulletArray = Array.isArray(items)
      ? items.map((item) => (typeof item === "string" ? item : item.text))
      : [];
  }

  if (bulletArray.length === 0) return null;

  return (
    <View style={styles.bulletList}>
      {bulletArray.map((item, i) => {
        if (!item || item.trim() === "") {
          return <View key={i} style={{ height: 8 }} />;
        }
        return (
          <View key={i} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        );
      })}
    </View>
  );
}
