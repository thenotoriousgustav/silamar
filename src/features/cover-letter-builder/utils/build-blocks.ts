import { isLexicalJson, lexicalJsonToHtml } from "@/lib/lexical-to-html";

import type { CoverLetterBuilderData } from "../types/cover-letter-content";
import type { Block } from "../components/pagination-engine";

/**
 * Converts CoverLetterBuilderData into an array of Blocks for the
 * pagination engine. Each logical section becomes one or more blocks.
 *
 * HTML is generated as strings so the measurer can inject them via
 * dangerouslySetInnerHTML without React re-rendering overhead.
 */
export function buildClassicBlocks(
  data: Partial<CoverLetterBuilderData>,
  styles: {
    nameClass: string;
    metaClass: string;
    bodyClass: string;
    headingClass: string;
  },
): Block[] {
  const blocks: Block[] = [];

  const {
    fullName,
    phone,
    email,
    address,
    cityAndPostal,
    recipientName,
    companyName,
    department,
    recipientAddress,
    recipientCityAndPostal,
    subject,
    content,
  } = data;

  // ── Sender block ──────────────────────────────────────────────────────
  const senderLines = [address, cityAndPostal, email, phone]
    .filter(Boolean)
    .map((l) => `<div>${escHtml(l!)}</div>`)
    .join("");

  blocks.push({
    id: "sender",
    html: `<div class="${styles.nameClass}">${escHtml(fullName || "NAMA ANDA")}</div>
           <div class="${styles.metaClass}">${senderLines}</div>`,
    marginBottom: 32,
  });

  // ── Date block ────────────────────────────────────────────────────────
  const dateStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  blocks.push({
    id: "date",
    html: `<div class="${styles.metaClass}">${dateStr}</div>`,
    marginBottom: 16,
  });

  // ── Recipient block ───────────────────────────────────────────────────
  const recipientLines = [
    department ? `<div>${escHtml(department)}</div>` : "",
    companyName ? `<div class="font-semibold">${escHtml(companyName)}</div>` : "",
    recipientAddress ? `<div>${escHtml(recipientAddress)}</div>` : "",
    recipientCityAndPostal ? `<div>${escHtml(recipientCityAndPostal)}</div>` : "",
  ].join("");

  blocks.push({
    id: "recipient",
    html: `<div class="${styles.headingClass}">${escHtml(recipientName || "Nama Penerima")}</div>
           <div class="${styles.metaClass}">${recipientLines}</div>`,
    marginBottom: 32,
  });

  // ── Subject block ─────────────────────────────────────────────────────
  if (subject) {
    blocks.push({
      id: "subject",
      html: `<div class="${styles.headingClass} uppercase">Perihal: ${escHtml(subject)}</div>`,
      marginBottom: 32,
    });
  }

  // ── Content paragraphs ────────────────────────────────────────────────
  const contentText = content || "Tulis isi surat lamaran Anda di sini...";

  if (isLexicalJson(contentText)) {
    // Lexical JSON — split per top-level block (paragraph/list) for accurate pagination
    const perBlockHtml = lexicalJsonToBlockHtml(contentText, styles.bodyClass);
    perBlockHtml.forEach((item, idx) => {
      blocks.push({
        id: `content-${idx}`,
        html: item.html,
        marginBottom: item.marginBottom,
      });
    });
  } else {
    // Plain text — split by newlines
    const paragraphs = contentText.split("\n");
    paragraphs.forEach((paragraph, idx) => {
      if (!paragraph.trim()) {
        blocks.push({ id: `br-${idx}`, html: `<div style="height:16px"></div>` });
        return;
      }
      blocks.push({
        id: `p-${idx}`,
        html: `<div class="${styles.bodyClass}">${escHtml(paragraph)}</div>`,
        marginBottom: 16,
      });
    });
  }

  return blocks;
}

/** Minimal HTML escaping to prevent XSS in dangerouslySetInnerHTML. */
function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Converts Lexical JSON to an array of per-block HTML strings.
 * Each top-level node (paragraph, list) becomes a separate block
 * so the pagination engine can measure and split them individually.
 */
function lexicalJsonToBlockHtml(
  lexicalJson: string,
  bodyClass: string,
): Array<{ html: string; marginBottom: number }> {
  try {
    const state = JSON.parse(lexicalJson) as {
      root: { children: Array<{ type: string }> };
    };
    if (!state?.root?.children) return [];

    const results: Array<{ html: string; marginBottom: number }> = [];

    for (const node of state.root.children) {
      // Re-serialize each top-level node as a mini Lexical doc and convert
      const miniDoc = JSON.stringify({ root: { children: [node], direction: null, format: "", indent: 0, type: "root", version: 1 } });
      const html = lexicalJsonToHtml(miniDoc);
      if (!html || html.trim() === "<p>&nbsp;</p>") {
        // Empty paragraph → spacer
        results.push({ html: `<div style="height:12px"></div>`, marginBottom: 0 });
        continue;
      }
      results.push({
        html: `<div class="${bodyClass} [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-1 [&_strong]:font-bold [&_u]:underline">${html}</div>`,
        marginBottom: 12,
      });
    }

    return results;
  } catch {
    return [];
  }
}
