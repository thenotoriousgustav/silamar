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
 * Classic template — centered header with double border, uppercase nameplate,
 * uppercase section titles separated by a double rule. Reads as formal /
 * traditional / "newspaper" feel.
 */
export function ClassicHtmlTemplate({
  data,
  onJumpToSection,
}: HtmlTemplateProps) {
  const { personalInfo } = data;
  const { fontClass, bodyTextClass, headingTextClass } = resolveHtmlStyle(
    data.style,
  );
  const translations = resolveTranslations(data.style?.language);
  const uppercaseHeaders = data.style?.uppercaseHeaders ?? true;

  const sectionTitleClass = cn(
    "hover:text-primary mb-2 mt-5 cursor-pointer pb-1 text-xs font-bold transition-colors border-b-2 border-double border-slate-900 tracking-[0.2em] text-slate-900",
    uppercaseHeaders && "uppercase",
  );

  const header = (
    <header
      key="header"
      onClick={() => onJumpToSection?.("personal")}
      className={cn(
        "mb-4 flex flex-col items-center text-center",
        CLICKABLE_CLASS,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col items-center",
          personalInfo.photoUrl && "flex-row items-center gap-6 text-left",
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
          <h1 className="mb-1 min-w-0 break-words text-2xl font-bold tracking-[0.2em] text-slate-900 uppercase">
            {personalInfo.fullName || "NAMA LENGKAP"}
          </h1>
          {personalInfo.title && (
            <p className="text-sm font-medium tracking-wide text-slate-600">
              {personalInfo.title}
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center text-center">
        <div className="text-[10px] text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
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
