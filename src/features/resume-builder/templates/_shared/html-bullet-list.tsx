"use client";

import { isLexicalJson, lexicalJsonToHtml } from "@/lib/lexical-to-html";
import { cn } from "@/lib/utils";
import type { DescriptionItem } from "@/types/resume";

interface HtmlBulletListProps {
  items: DescriptionItem[] | string | undefined;
  bodyTextClass: string;
}

/**
 * Renders a bullet list for the HTML preview.
 * Accepts Lexical JSON (from rich text editor) or DescriptionItem[] (from PDF import).
 */
export function HtmlBulletList({ items, bodyTextClass }: HtmlBulletListProps) {
  if (!items) return null;

  // Lexical JSON from rich text editor
  if (typeof items === "string") {
    if (!isLexicalJson(items)) return null;
    const html = lexicalJsonToHtml(items);
    if (!html) return null;
    return (
      <div
        className={cn(
          "prose-resume mt-1 [&_li]:list-disc [&_ol]:list-decimal [&_ul]:list-disc [&_ul]:pl-4",
          bodyTextClass,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // DescriptionItem[] from PDF import
  if (items.length === 0) return null;

  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4">
      {items.map((item) => (
        <li key={item.id} className={bodyTextClass}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}
