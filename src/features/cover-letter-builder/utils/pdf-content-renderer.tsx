import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { isLexicalJson, lexicalJsonToTextLines } from "@/lib/lexical-to-html";

/**
 * Converts cover letter `content` (plain text or Lexical JSON) into an array
 * of @react-pdf Text elements, one per paragraph/list-item.
 *
 * Lexical JSON → extract text lines via lexicalJsonToTextLines()
 * Plain text   → split by newline
 */
export function renderPdfContent(
  content: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentStyle: any,
  fallback = "Tulis isi surat lamaran Anda di sini...",
): React.ReactNode {
  const raw = content || fallback;

  const lines: string[] = isLexicalJson(raw)
    ? lexicalJsonToTextLines(raw).filter(Boolean)
    : raw.split("\n").filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return <Text style={contentStyle}>{fallback}</Text>;
  }

  return (
    <View>
      {lines.map((line, idx) => (
        <Text key={idx} style={{ ...contentStyle, marginBottom: 6 }}>
          {line}
        </Text>
      ))}
    </View>
  );
}
