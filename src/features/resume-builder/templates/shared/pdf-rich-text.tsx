"use client";

/**
 * Converts Lexical JSON rich text to @react-pdf <Text> nodes.
 *
 * @react-pdf doesn't support HTML, but supports nested <Text> with inline
 * styles. This module walks the Lexical AST and produces a React tree of
 * <Text> elements that preserves bold, italic, underline, and strikethrough.
 *
 * Lexical format bitmask:
 *   1  = bold
 *   2  = italic
 *   4  = strikethrough
 *   8  = underline
 *   16 = code
 */

import { Text } from "@react-pdf/renderer";
import React from "react";

// ─── Lexical AST types (minimal) ─────────────────────────────────────────────

type LexicalTextNode = {
  type: "text";
  text: string;
  format: number;
};

type LexicalLineBreakNode = { type: "linebreak" };

type LexicalNode =
  | LexicalTextNode
  | LexicalLineBreakNode
  | { type: string; children?: LexicalNode[]; text?: string; format?: number };

type LexicalRoot = { root: { children: LexicalNode[] } };

// ─── Inline text renderer ─────────────────────────────────────────────────────

function renderInlineNode(
  node: LexicalNode,
  baseStyle: Record<string, unknown>,
  key: string,
): React.ReactNode {
  if (node.type === "linebreak") {
    return "\n";
  }

  if (node.type === "text") {
    const t = node as LexicalTextNode;
    if (!t.text) return null;

    const fmt = t.format ?? 0;
    const style: Record<string, unknown> = { ...baseStyle };

    if (fmt & 1) style.fontWeight = 700;
    if (fmt & 2) style.fontStyle = "italic";
    if (fmt & 8) style.textDecoration = "underline";
    if (fmt & 4) style.textDecoration = "line-through";
    // underline + strikethrough combined
    if ((fmt & 8) && (fmt & 4)) style.textDecoration = "underline line-through";

    // If no formatting, return plain string (avoids unnecessary nesting)
    if (fmt === 0) return t.text;

    return (
      <Text key={key} style={style}>
        {t.text}
      </Text>
    );
  }

  // Link or other inline node with children
  const n = node as { children?: LexicalNode[] };
  if (n.children) {
    return n.children.map((child, i) =>
      renderInlineNode(child, baseStyle, `${key}-${i}`),
    );
  }

  const fallback = node as { text?: string };
  return fallback.text ?? null;
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function renderBlock(
  node: LexicalNode,
  baseStyle: Record<string, unknown>,
  key: string,
): React.ReactNode {
  const n = node as { children?: LexicalNode[]; type: string };

  switch (n.type) {
    case "paragraph":
    case "heading":
    case "quote": {
      const children = (n.children ?? []).map((child, i) =>
        renderInlineNode(child, baseStyle, `${key}-${i}`),
      );
      // Wrap each block in its own <Text> so it gets a line break after it
      return (
        <Text key={key} style={baseStyle}>
          {children}
          {"\n"}
        </Text>
      );
    }

    case "list": {
      const list = node as { children?: LexicalNode[]; listType?: string };
      return (list.children ?? []).map((item, i) => {
        const itemChildren = (
          (item as { children?: LexicalNode[] }).children ?? []
        ).map((child, j) =>
          renderInlineNode(child, baseStyle, `${key}-${i}-${j}`),
        );
        return (
          <Text key={`${key}-${i}`} style={baseStyle}>
            {"• "}
            {itemChildren}
            {"\n"}
          </Text>
        );
      });
    }

    default: {
      if (n.children) {
        return n.children.map((child, i) =>
          renderBlock(child, baseStyle, `${key}-${i}`),
        );
      }
      return null;
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

interface LexicalRichTextProps {
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style: any;
}

/**
 * Renders Lexical JSON rich text as @react-pdf <Text> nodes.
 * Preserves bold, italic, underline, and strikethrough formatting.
 * Falls back to plain text if the value is not valid Lexical JSON.
 */
export function LexicalRichText({
  value,
  style,
}: LexicalRichTextProps): React.ReactElement | null {
  if (!value) return null;

  let state: LexicalRoot;
  try {
    const parsed = JSON.parse(value);
    if (!parsed?.root?.children) {
      // Plain text fallback
      return <Text style={style}>{value}</Text>;
    }
    state = parsed as LexicalRoot;
  } catch {
    return <Text style={style}>{value}</Text>;
  }

  const blocks = state.root.children
    .map((node, i) => renderBlock(node, style, `block-${i}`))
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return <>{blocks}</>;
}
