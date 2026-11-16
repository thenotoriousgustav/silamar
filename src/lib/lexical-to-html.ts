/**
 * Lightweight Lexical AST utilities for the PDF renderer.
 *
 * Lexical's serialized editor state (JSON) is parsed without instantiating
 * a Lexical editor, so this is safe to use in server components and PDF
 * preview renderers where the editor isn't mounted.
 *
 * Only two helpers are exposed:
 *  - `isLexicalJson` — detects whether a string is Lexical JSON
 *  - `lexicalJsonToTextLines` — extracts plain text per block-level node
 *
 * The PDF rich-text renderer (`pdf-rich-text.tsx`) walks the Lexical AST
 * directly to preserve formatting, so an HTML serializer is not needed.
 */

type LexicalTextNode = {
  type: "text";
  text: string;
  format: number; // bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
  style?: string;
};

type LexicalListNode = {
  type: "list";
  listType: "bullet" | "number" | "check";
  children: LexicalNode[];
};

type LexicalNode =
  | LexicalTextNode
  | LexicalListNode
  | { type: string; children?: LexicalNode[]; text?: string };

type LexicalRoot = {
  root: {
    children: LexicalNode[];
  };
};

/**
 * Extracts plain text lines from a Lexical serialized JSON string.
 * Used for PDF rendering where HTML is not supported.
 * Returns an array of text lines (one per block-level node).
 */
export function lexicalJsonToTextLines(value: string): string[] {
  try {
    const state = JSON.parse(value) as LexicalRoot;
    if (!state?.root?.children) return [];

    const lines: string[] = [];

    function extractText(node: LexicalNode): string {
      switch (node.type) {
        case "text":
          return (node as LexicalTextNode).text;
        case "linebreak":
          return "\n";
        default: {
          const n = node as { children?: LexicalNode[]; text?: string };
          if (n.children) return n.children.map(extractText).join("");
          if (n.text) return (n as LexicalTextNode).text;
          return "";
        }
      }
    }

    function walkNode(node: LexicalNode) {
      switch (node.type) {
        case "paragraph":
        case "heading":
        case "quote": {
          const text = extractText(node).trim();
          if (text) lines.push(text);
          break;
        }
        case "list": {
          const l = node as LexicalListNode;
          (l.children ?? []).forEach((item) => {
            const text = extractText(item).trim();
            if (text) lines.push(text);
          });
          break;
        }
        case "listitem": {
          const text = extractText(node).trim();
          if (text) lines.push(text);
          break;
        }
        default: {
          const n = node as { children?: LexicalNode[] };
          if (n.children) n.children.forEach(walkNode);
          break;
        }
      }
    }

    state.root.children.forEach(walkNode);
    return lines;
  } catch {
    return [];
  }
}

/**
 * Detects whether a string is Lexical-serialized editor state JSON.
 */
export function isLexicalJson(value: string): boolean {
  try {
    const parsed = JSON.parse(value);
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      "root" in parsed &&
      typeof parsed.root === "object"
    );
  } catch {
    return false;
  }
}
