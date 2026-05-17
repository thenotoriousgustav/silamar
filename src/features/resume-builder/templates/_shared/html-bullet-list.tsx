"use client";

import { isLexicalJson, lexicalJsonToHtml } from "@/lib/lexical-to-html";
import { cn } from "@/lib/utils";
import type { DescriptionItem } from "@/types/resume";

interface HtmlBulletListProps {
  items: DescriptionItem[] | string[] | string | undefined;
  /** Tailwind classes applied to body text inside the list. */
  bodyTextClass: string;
}

/**
 * Renders a bullet list for the HTML preview. Accepts:
 *  - Lexical-serialized JSON  → converted to HTML and rendered safely.
 *  - HTML fragments            → rendered as-is via dangerouslySetInnerHTML.
 *  - Plain strings or string[] → split by newline and rendered as <ul>.
 *  - DescriptionItem[]         → rendered as <ul>.
 */
export function HtmlBulletList({ items, bodyTextClass }: HtmlBulletListProps) {
  if (!items) return null;

  if (typeof items === "string" && isLexicalJson(items)) {
    const html = lexicalJsonToHtml(items);
    if (html) {
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
    return null;
  }

  if (
    typeof items === "string" &&
    (items.includes("<p>") ||
      items.includes("<ul>") ||
      items.includes("<li>"))
  ) {
    return (
      <div
        className={cn(
          "prose-resume mt-1 [&_li]:list-disc [&_ol]:list-decimal [&_ul]:list-disc [&_ul]:pl-4",
          bodyTextClass,
        )}
        dangerouslySetInnerHTML={{ __html: items }}
      />
    );
  }

  const bulletArray = Array.isArray(items)
    ? items.map((item) => (typeof item === "string" ? item : item.text))
    : (items as string).split("\n").filter(Boolean);

  if (bulletArray.length === 0) return null;

  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4">
      {bulletArray.map((item, i) => {
        if (!item || item.trim() === "") {
          return <li key={i} className="h-2 list-none" />;
        }
        return (
          <li key={i} className={bodyTextClass}>
            {item}
          </li>
        );
      })}
    </ul>
  );
}
