"use client";

import { Text, View } from "@react-pdf/renderer";

import { isLexicalJson, lexicalJsonToTextLines } from "@/lib/lexical-to-html";
import type { DescriptionItem } from "@/types/resume";

import { LexicalRichText } from "./pdf-rich-text";

interface PdfBulletListProps {
  items: DescriptionItem[] | string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any;
}

/**
 * Renders a bullet list for PDF, preserving inline rich text formatting
 * (bold, italic, underline) from the Lexical editor.
 *
 * - string (Lexical JSON): each paragraph/list-item becomes one bullet
 * - DescriptionItem[]: each item.text is rendered as a bullet (plain text
 *   from PDF import — no Lexical formatting)
 */
export function PdfBulletList({ items, styles }: PdfBulletListProps) {
  if (!items) return null;

  // ── Lexical JSON string ───────────────────────────────────────────────
  if (typeof items === "string") {
    if (!isLexicalJson(items)) return null;

    // Extract plain-text lines just to know how many bullets there are
    // and to handle empty-content early exit.
    const lines = lexicalJsonToTextLines(items).filter(Boolean);
    if (lines.length === 0) return null;

    // Parse the Lexical AST once and render each top-level block as a bullet.
    let state: { root: { children: unknown[] } };
    try {
      state = JSON.parse(items);
    } catch {
      return null;
    }

    const blocks = state.root.children as Array<{
      type: string;
      children?: unknown[];
      listType?: string;
    }>;

    const bullets: React.ReactNode[] = [];

    blocks.forEach((block, blockIdx) => {
      if (block.type === "list") {
        // Lexical list → each listitem is a bullet
        (block.children ?? []).forEach((item, itemIdx) => {
          const itemJson = JSON.stringify({
            root: { children: [item] },
          });
          bullets.push(
            <View key={`${blockIdx}-${itemIdx}`} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <LexicalRichText value={itemJson} style={styles.bulletText} />
            </View>,
          );
        });
      } else if (block.type === "paragraph" || block.type === "heading") {
        // Each paragraph is a bullet
        const blockJson = JSON.stringify({ root: { children: [block] } });
        bullets.push(
          <View key={blockIdx} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <LexicalRichText value={blockJson} style={styles.bulletText} />
          </View>,
        );
      }
    });

    if (bullets.length === 0) return null;
    return <View style={styles.bulletList}>{bullets}</View>;
  }

  // ── DescriptionItem[] (from PDF import — plain text) ──────────────────
  if (items.length === 0) return null;

  return (
    <View style={styles.bulletList}>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}
