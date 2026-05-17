"use client";

import { isLexicalJson, lexicalJsonToHtml } from "@/lib/lexical-to-html";
import { cn } from "@/lib/utils";

import { CLICKABLE_CLASS } from "./html-render-helpers";
import type { ResumeTranslations } from "./translations";

interface HtmlSummaryProps {
  summary: string;
  bodyTextClass: string;
  sectionTitleClass: string;
  translations: ResumeTranslations;
  onJumpToSection?: (sectionId: string) => void;
}

/**
 * Renders the "Professional Summary" section. Supports both plain text
 * (legacy) and Lexical-serialized JSON (from the rich text editor).
 */
export function HtmlSummary({
  summary,
  bodyTextClass,
  sectionTitleClass,
  translations,
  onJumpToSection,
}: HtmlSummaryProps) {
  // Determine if the summary is Lexical JSON or plain text.
  const isRichText = isLexicalJson(summary);
  const html = isRichText ? lexicalJsonToHtml(summary) : null;

  return (
    <section
      key="summary"
      className={cn("mb-5", CLICKABLE_CLASS)}
      onClick={() => onJumpToSection?.("personal")}
    >
      <h2 className={sectionTitleClass}>{translations.professionalSummary}</h2>
      {html ? (
        <div
          className={cn(
            "prose-resume text-justify [&_li]:list-disc [&_ol]:list-decimal [&_ul]:list-disc [&_ul]:pl-4",
            bodyTextClass,
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className={cn("text-justify", bodyTextClass)}>{summary}</p>
      )}
    </section>
  );
}
