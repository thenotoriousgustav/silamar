"use client";

import { cn } from "@/lib/utils";

import { cleanUrl } from "../_shared/constants";
import { renderHtmlPages } from "../_shared/html-engine";
import { HtmlPageWrapper } from "../_shared/html-page-wrapper";
import { CLICKABLE_CLASS } from "../_shared/html-render-helpers";
import { resolveHtmlStyle } from "../_shared/html-style-resolver";
import { resolveTranslations } from "../_shared/translations";
import type { HtmlTemplateProps } from "../types";

/**
 * Minimal template — left-aligned header, lowercase / lighter weight name,
 * subtle left-accent on section titles. Reads as understated / editorial.
 */
export function MinimalHtmlTemplate({
  data,
  onJumpToSection,
}: HtmlTemplateProps) {
  const { personalInfo } = data;
  const { fontClass, bodyTextClass, headingTextClass } = resolveHtmlStyle(
    data.style,
  );
  const translations = resolveTranslations(data.style?.language);
  const uppercaseHeaders = data.style?.uppercaseHeaders ?? false;

  const sectionTitleClass = cn(
    "hover:text-primary mb-3 mt-5 cursor-pointer pb-1 transition-colors border-l-[3px] border-slate-300 pl-3 text-[13px] font-medium tracking-wide text-slate-700",
    uppercaseHeaders ? "uppercase" : "normal-case",
  );

  const header = (
    <header
      key="header"
      onClick={() => onJumpToSection?.("personal")}
      className={cn(
        "mb-6 flex flex-col items-start gap-4 pb-2 text-left",
        CLICKABLE_CLASS,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col items-start",
          personalInfo.photoUrl && "flex-row items-center gap-6",
        )}
      >
        {personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="h-24 w-24 rounded-full border border-slate-200 object-cover shadow-sm"
          />
        )}
        <div className={cn("min-w-0", personalInfo.photoUrl && "flex-1")}>
          <h1 className="mb-1 min-w-0 break-words text-3xl font-light tracking-normal text-slate-900">
            {personalInfo.fullName || "NAMA LENGKAP"}
          </h1>
          {personalInfo.title && (
            <p className="text-xs font-normal uppercase tracking-[0.2em] text-slate-500">
              {personalInfo.title}
            </p>
          )}
        </div>
      </div>

      <div className="mt-1 flex flex-col items-start text-left">
        <div className="text-[10px] text-slate-500">
          <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-0.5">
            <span>{personalInfo.email}</span>
            {personalInfo.phone && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.location}</span>
              </>
            )}
          </div>
          {(personalInfo.website?.url || personalInfo.linkedin?.url) && (
            <div className="mt-0.5 space-x-2">
              {personalInfo.website?.url && (
                <a
                  href={personalInfo.website.url}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.website.label ||
                    cleanUrl(personalInfo.website.url)}
                </a>
              )}
              {personalInfo.linkedin?.url && (
                <a
                  href={personalInfo.linkedin.url}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {personalInfo.linkedin.label ||
                    cleanUrl(personalInfo.linkedin.url)}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const pages = renderHtmlPages({
    data,
    translations,
    bodyTextClass,
    headingTextClass,
    sectionTitleClass,
    headerElement: header,
    onJumpToSection,
  });

  return <HtmlPageWrapper pages={pages} containerClass={fontClass} />;
}
