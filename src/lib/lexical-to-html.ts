/**
 * Converts a Lexical serialized editor state (JSON string or object) to an HTML string.
 * This is a lightweight parser that does NOT require a Lexical editor instance,
 * so it's safe to use in server components and preview renderers.
 */

type LexicalTextNode = {
  type: "text";
  text: string;
  format: number; // bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
  style?: string;
};

type LexicalLinkNode = {
  type: "link";
  url: string;
  children: LexicalNode[];
};

type LexicalListItemNode = {
  type: "listitem";
  children: LexicalNode[];
  checked?: boolean;
};

type LexicalListNode = {
  type: "list";
  listType: "bullet" | "number" | "check";
  children: LexicalListItemNode[];
};

type LexicalHeadingNode = {
  type: "heading";
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: LexicalNode[];
};

type LexicalParagraphNode = {
  type: "paragraph";
  children: LexicalNode[];
};

type LexicalQuoteNode = {
  type: "quote";
  children: LexicalNode[];
};

type LexicalLineBreakNode = {
  type: "linebreak";
};

type LexicalNode =
  | LexicalTextNode
  | LexicalLinkNode
  | LexicalListNode
  | LexicalListItemNode
  | LexicalHeadingNode
  | LexicalParagraphNode
  | LexicalQuoteNode
  | LexicalLineBreakNode
  | { type: string; children?: LexicalNode[]; text?: string };

type LexicalRoot = {
  root: {
    children: LexicalNode[];
  };
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders a Lexical text node to HTML with inline formatting.
 * Uses a bitmask to apply formatting: 1=bold, 2=italic, 4=strikethrough,
 * 8=underline, 16=code, 32=subscript, 64=superscript.
 */
function renderTextNode(node: LexicalTextNode): string {
  let html = escapeHtml(node.text);
  const fmt = node.format;
  // Apply inline formatting via bitmask
  if (fmt & 16) html = `<code>${html}</code>`;
  if (fmt & 4) html = `<s>${html}</s>`;
  if (fmt & 8) html = `<u>${html}</u>`;
  if (fmt & 2) html = `<em>${html}</em>`;
  if (fmt & 1) html = `<strong>${html}</strong>`;
  if (fmt & 32) html = `<sub>${html}</sub>`;
  if (fmt & 64) html = `<sup>${html}</sup>`;
  return html;
}

function renderChildren(children: LexicalNode[]): string {
  return children.map(renderNode).join("");
}

/**
 * Recursively renders a Lexical AST node to HTML.
 * Handles all block-level (paragraph, heading, quote, list) and inline
 * (text, link, linebreak) node types with a fallback for unknown nodes.
 */
function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case "text":
      return renderTextNode(node as LexicalTextNode);

    case "linebreak":
      return "<br/>";

    case "paragraph": {
      const inner = renderChildren((node as LexicalParagraphNode).children ?? []);
      // Empty paragraph → preserve spacing
      return inner.trim() === "" ? "<p>&nbsp;</p>" : `<p>${inner}</p>`;
    }

    case "heading": {
      const h = node as LexicalHeadingNode;
      return `<${h.tag}>${renderChildren(h.children ?? [])}</${h.tag}>`;
    }

    case "quote": {
      return `<blockquote>${renderChildren((node as LexicalQuoteNode).children ?? [])}</blockquote>`;
    }

    case "link": {
      const l = node as LexicalLinkNode;
      const href = escapeHtml(l.url ?? "");
      return `<a href="${href}" rel="noopener noreferrer" target="_blank">${renderChildren(l.children ?? [])}</a>`;
    }

    case "list": {
      const l = node as LexicalListNode;
      const tag = l.listType === "number" ? "ol" : "ul";
      const items = (l.children ?? []).map(renderNode).join("");
      return `<${tag}>${items}</${tag}>`;
    }

    case "listitem": {
      const li = node as LexicalListItemNode;
      return `<li>${renderChildren(li.children ?? [])}</li>`;
    }

    default: {
      // Fallback: if node has children, render them; if it has text, return it
      const n = node as { children?: LexicalNode[]; text?: string };
      if (n.children) return renderChildren(n.children);
      if (n.text) return escapeHtml(n.text);
      return "";
    }
  }
}

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

/**
 * Converts a Lexical serialized JSON string to an HTML string.
 * Returns null if the input is not valid Lexical JSON.
 */
export function lexicalJsonToHtml(value: string): string | null {
  try {
    const state = JSON.parse(value) as LexicalRoot;
    if (!state?.root?.children) return null;
    const html = renderChildren(state.root.children);
    return html;
  } catch {
    return null;
  }
}


/**
 * Extracts plain text lines from an HTML string.
 * Used for PDF rendering (which doesn't support HTML).
 * Preserves block-level structure (one line per paragraph/list item).
 *
 * Handles common rich-text HTML: <p>, <ul>, <ol>, <li>, <h1-6>, <br>.
 */
export function htmlToTextLines(html: string): string[] {
  if (!html) return [];

  // Strip script/style blocks entirely
  const cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Insert newline before block-closing tags so they break into separate lines
  const withBreaks = cleaned
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|li|h[1-6]|div|blockquote)\s*>/gi, "\n");

  // Strip all remaining tags
  const textOnly = withBreaks.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  const decoded = textOnly
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return decoded
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Detects whether a string contains HTML tags (heuristic).
 * Used to choose between HTML and plain-text parsing.
 */
export function looksLikeHtml(value: string): boolean {
  return /<\/?(p|ul|ol|li|h[1-6]|br|div|blockquote|strong|em|a)\b[^>]*>/i.test(
    value,
  );
}
