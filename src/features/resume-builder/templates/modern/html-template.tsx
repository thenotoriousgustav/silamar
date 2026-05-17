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
 * Modern template — two-column header with blue accent, tinted-block section
 * titles, accent color on experience titles. Reads as contemporary / corporate.
 */
export function ModernHtmlTemplate({
  data,
  onJumpToSection,
}: HtmlTemplateProps) {
  const { personalInfo } = data;
  const { fontClass, bodyTextClass, headingTextClass, densityClasses } = resolveHtmlStyle(
    data.style,
  );
  const translations = resolveTranslations(data.style?.language);
  const uppercaseHeaders = data.style?.uppercaseHeaders ?? true;

  const sectionTitleClass = cn(
    "hover:text-primary mb-3 cursor-pointer pb-1 text-xs font-bold transition-colors rounded-sm bg-blue-50 px-3 py-1.5 tracking-widest text-blue-600",
    densityClasses.sectionMt,
    uppercaseHeaders && "uppercase",
  );

  const header = (
    <header
      key="header"
      onClick={() => onJumpToSection?.("personal")}
      className={cn(
        "mb-6 flex flex-row items-center justify-between gap-4 border-b-2 border-blue-600 pb-4 text-left",
        CLICKABLE_CLASS,
      )}
    >
      <div className="flex min-w-0 flex-1">
        <div className="min-w-0">
          <h1 className="mb-0 min-w-0 break-words truncate text-2xl font-bold tracking-tight text-blue-600 sm:text-3xl">
            {personalInfo.fullName || "NAMA LENGKAP"}
          </h1>
          {personalInfo.title && (
            <p className="text-base font-medium text-blue-600">
              {personalInfo.title}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end text-right">
        {personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="mb-2 h-20 w-20 rounded-full border-2 border-blue-600 object-cover shadow-md"
          />
        )}
        <div className="mt-0 text-right text-[10px] text-slate-500">
          <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-0.5">
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
    itemGapClass: densityClasses.itemGap,
    experienceTitleColorClass: "text-blue-600",
    headerElement: header,
    onJumpToSection,
  });

  return <HtmlPageWrapper pages={pages} containerClass={fontClass} />;
}
