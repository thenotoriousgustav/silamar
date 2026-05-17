"use client";

import { cn, formatResumeDate } from "@/lib/utils";

import { cleanUrl } from "../_shared/constants";
import { HtmlBulletList } from "../_shared/html-bullet-list";
import { renderHtmlPages } from "../_shared/html-engine";
import { HtmlPageWrapper } from "../_shared/html-page-wrapper";
import { CLICKABLE_CLASS } from "../_shared/html-render-helpers";
import { resolveHtmlStyle } from "../_shared/html-style-resolver";
import { HtmlSummary } from "../_shared/html-summary";
import { contentHeightLimitFor, estimateHeight } from "../_shared/pagination";
import { resolveTranslations } from "../_shared/translations";
import type { HtmlTemplateProps } from "../types";

/**
 * Harvard template — faithful to the Harvard OCS resume format:
 *  - Name centered, bold (not uppercase), with underline decoration
 *  - Single full-width rule immediately below the name
 *  - Contact info centered below the rule, bullet-separated
 *  - Section titles bold, centered, no border — just text
 *  - Items: Organization/Company bold on left, location on right (first row)
 *           Position title bold on left, date range on right (second row)
 *  - Bullet points indented below
 */
export function HarvardHtmlTemplate({
  data,
  onJumpToSection,
}: HtmlTemplateProps) {
  const { personalInfo } = data;
  const { fontClass, bodyTextClass, headingTextClass, densityClasses } =
    resolveHtmlStyle(data.style);
  const translations = resolveTranslations(data.style?.language);

  // Section title: bold, centered, no border — pure Harvard style
  const sectionTitleClass = cn(
    "hover:text-primary cursor-pointer font-bold text-center text-slate-900 transition-colors text-[11px]",
    densityClasses.sectionMt,
    densityClasses.sectionGap,
  );

  // ── Header ──────────────────────────────────────────────────────────────
  const header = (
    <header
      key="header"
      onClick={() => onJumpToSection?.("personal")}
      className={cn("mb-3 flex flex-col items-center text-center", CLICKABLE_CLASS)}
    >
      {/* Name — bold, underlined, not uppercase */}
      <h1 className="text-[14px] font-bold underline decoration-slate-900 underline-offset-2 text-slate-900">
        {personalInfo.fullName || "Firstname Lastname"}
      </h1>

      {/* Full-width rule immediately below name */}
      <div className="mt-1 h-[1px] w-full bg-slate-900" />

      {/* Contact line — centered, bullet-separated */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-[10px] text-slate-700">
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.location && personalInfo.email && (
          <span className="text-slate-500">•</span>
        )}
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} className="hover:underline">
            {personalInfo.email}
          </a>
        )}
        {personalInfo.phone && (
          <>
            <span className="text-slate-500">•</span>
            <a href={`tel:${personalInfo.phone}`} className="hover:underline">
              {personalInfo.phone}
            </a>
          </>
        )}
        {personalInfo.linkedin?.url && (
          <>
            <span className="text-slate-500">•</span>
            <a
              href={personalInfo.linkedin.url}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {personalInfo.linkedin.label ||
                cleanUrl(personalInfo.linkedin.url)}
            </a>
          </>
        )}
        {personalInfo.website?.url && (
          <>
            <span className="text-slate-500">•</span>
            <a
              href={personalInfo.website.url}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {personalInfo.website.label ||
                cleanUrl(personalInfo.website.url)}
            </a>
          </>
        )}
      </div>
    </header>
  );

  // ── Custom paginator (Harvard-specific item layout) ──────────────────────
  const paperSize = data.style?.paperSize || "A4";
  const limit = contentHeightLimitFor(paperSize);
  const pages: React.ReactNode[][] = [[]];
  let currentHeight = 0;
  let currentPage = 0;

  const addToPage = (element: React.ReactNode, height: number) => {
    if (currentHeight + height > limit && pages[currentPage].length > 0) {
      currentPage++;
      pages[currentPage] = [];
      currentHeight = 0;
    }
    pages[currentPage].push(element);
    currentHeight += height;
  };

  addToPage(header, estimateHeight("header", null));

  if (personalInfo.summary) {
    addToPage(
      <HtmlSummary
        key="summary"
        summary={personalInfo.summary}
        bodyTextClass={bodyTextClass}
        sectionTitleClass={sectionTitleClass}
        translations={translations}
        onJumpToSection={onJumpToSection}
      />,
      estimateHeight("summary", personalInfo.summary),
    );
  }

  const sectionOrder = data.sectionOrder || [
    "experience",
    "education",
    "projects",
    "skills",
    "custom",
  ];

  for (const sectionId of sectionOrder) {
    // ── Experience ──────────────────────────────────────────────────────
    if (sectionId === "experience" && data.experience.length > 0) {
      addToPage(
        <h2
          key="exp-title"
          onClick={() => onJumpToSection?.("experience")}
          className={sectionTitleClass}
        >
          {translations.workExperience}
        </h2>,
        estimateHeight("sectionTitle", null),
      );

      data.experience.forEach((exp, i) => {
        addToPage(
          <div
            key={`exp-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`experience-${exp.id}`)}
          >
            {/* Row 1: Organization (bold) — Location */}
            <div className="flex items-baseline justify-between">
              <span className={cn(headingTextClass, "text-slate-900")}>
                {exp.company}
              </span>
              {exp.location && (
                <span className="text-[10px] text-slate-700">{exp.location}</span>
              )}
            </div>
            {/* Row 2: Position Title (bold) — Date range */}
            <div className="flex items-baseline justify-between">
              <span className={cn(headingTextClass, "text-slate-900")}>
                {exp.position}
                {exp.employmentType && `, ${exp.employmentType}`}
              </span>
              <span className="text-[10px] text-slate-700">
                {formatResumeDate(exp.startDate)} —{" "}
                {exp.isCurrentJob
                  ? translations.present
                  : exp.endDate
                    ? formatResumeDate(exp.endDate)
                    : ""}
              </span>
            </div>
            <HtmlBulletList
              items={exp.description}
              bodyTextClass={bodyTextClass}
            />
          </div>,
          estimateHeight("experienceItem", exp),
        );
      });
    }

    // ── Education ───────────────────────────────────────────────────────
    else if (sectionId === "education" && data.education.length > 0) {
      addToPage(
        <h2
          key="edu-title"
          onClick={() => onJumpToSection?.("education")}
          className={sectionTitleClass}
        >
          {translations.education}
        </h2>,
        estimateHeight("sectionTitle", null),
      );

      data.education.forEach((edu, i) => {
        addToPage(
          <div
            key={`edu-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`education-${edu.id}`)}
          >
            {/* Row 1: Institution (bold) — Location */}
            <div className="flex items-baseline justify-between">
              <span className={cn(headingTextClass, "text-slate-900")}>
                {edu.institution}
              </span>
              {edu.location && (
                <span className="text-[10px] text-slate-700">{edu.location}</span>
              )}
            </div>
            {/* Row 2: Degree + Major — Date range */}
            <div className="flex items-baseline justify-between">
              <span className={cn(bodyTextClass, "text-slate-900")}>
                {edu.degree}
                {edu.major && `, ${edu.major}`}
              </span>
              <span className="text-[10px] text-slate-700">
                {edu.startYear} —{" "}
                {edu.isCurrentlyStudying
                  ? translations.present
                  : edu.endYear || ""}
              </span>
            </div>
            {edu.gpa && (
              <div className={bodyTextClass}>
                {translations.gpa}: {edu.gpa}
              </div>
            )}
            {edu.description && (
              <HtmlBulletList
                items={edu.description}
                bodyTextClass={bodyTextClass}
              />
            )}
          </div>,
          estimateHeight("educationItem", edu),
        );
      });
    }

    // ── Skills ──────────────────────────────────────────────────────────
    else if (sectionId === "skills" && data.skills.length > 0) {
      addToPage(
        <h2
          key="skills-title"
          onClick={() => onJumpToSection?.("skills")}
          className={sectionTitleClass}
        >
          {translations.skills}
        </h2>,
        estimateHeight("sectionTitle", null),
      );

      data.skills.forEach((skill, i) => {
        addToPage(
          <div
            key={`skill-${i}`}
            className={cn(bodyTextClass, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`skills-${skill.id}`)}
          >
            <span className="font-bold">{skill.category}: </span>
            <span>{(skill.items || []).join(", ")}</span>
          </div>,
          estimateHeight("skillItem", skill),
        );
      });
    }

    // ── Projects ────────────────────────────────────────────────────────
    else if (sectionId === "projects" && data.projects.length > 0) {
      addToPage(
        <h2
          key="proj-title"
          onClick={() => onJumpToSection?.("projects")}
          className={sectionTitleClass}
        >
          {translations.projects}
        </h2>,
        estimateHeight("sectionTitle", null),
      );

      data.projects.forEach((project, i) => {
        addToPage(
          <div
            key={`proj-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`projects-${project.id}`)}
          >
            <div className="flex items-baseline justify-between">
              <span className={cn(headingTextClass, "text-slate-900")}>
                {project.name}
              </span>
              {(project.startDate || project.endDate) && (
                <span className="text-[10px] text-slate-700">
                  {formatResumeDate(project.startDate)}{" "}
                  {project.endDate
                    ? `— ${formatResumeDate(project.endDate)}`
                    : ""}
                </span>
              )}
            </div>
            {project.link && (
              <div className="text-[9px] text-slate-500">
                {cleanUrl(project.link)}
              </div>
            )}
            <HtmlBulletList
              items={project.description}
              bodyTextClass={bodyTextClass}
            />
          </div>,
          estimateHeight("projectItem", project),
        );
      });
    }

    // ── Certificates / Awards / Publications ────────────────────────────
    else if (
      (sectionId === "certificates" && data.certificates?.length) ||
      (sectionId === "awards" && data.awards?.length) ||
      (sectionId === "publications" && data.publications?.length)
    ) {
      const list =
        sectionId === "certificates"
          ? data.certificates
          : sectionId === "awards"
            ? data.awards
            : data.publications;
      const titleText =
        sectionId === "certificates"
          ? translations.certificates
          : sectionId === "awards"
            ? translations.awards
            : translations.publications;

      if (list && list.length > 0) {
        addToPage(
          <h2
            key={`${sectionId}-title`}
            onClick={() => onJumpToSection?.(sectionId)}
            className={sectionTitleClass}
          >
            {titleText}
          </h2>,
          estimateHeight("sectionTitle", null),
        );

        list.forEach((item, i) => {
          addToPage(
            <div
              key={`${sectionId}-${i}`}
              className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
              onClick={() => onJumpToSection?.(`${sectionId}-${item.id}`)}
            >
              <div className="flex items-baseline justify-between">
                <span className={cn(headingTextClass, "text-slate-900")}>
                  {item.title}
                </span>
                {item.date && (
                  <span className="text-[10px] text-slate-700">
                    {formatResumeDate(item.date)}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <div className={bodyTextClass}>{item.subtitle}</div>
              )}
              {item.link && (
                <div className="text-[9px] text-slate-500">
                  {cleanUrl(item.link)}
                </div>
              )}
              <HtmlBulletList
                items={item.description}
                bodyTextClass={bodyTextClass}
              />
            </div>,
            estimateHeight("certificatesItem", item),
          );
        });
      }
    }

    // ── Custom sections ─────────────────────────────────────────────────
    else if (sectionId === "custom" && data.customSections?.length) {
      for (const section of data.customSections) {
        addToPage(
          <h2
            key={`custom-title-${section.id}`}
            onClick={() => onJumpToSection?.(`custom-${section.id}`)}
            className={sectionTitleClass}
          >
            {section.title}
          </h2>,
          estimateHeight("sectionTitle", null),
        );

        section.items.forEach((item, iIdx) => {
          const period = item.startDate
            ? `${formatResumeDate(item.startDate)} — ${
                item.isCurrent
                  ? translations.present
                  : item.endDate
                    ? formatResumeDate(item.endDate)
                    : ""
              }`
            : item.date
              ? formatResumeDate(item.date)
              : "";

          addToPage(
            <div
              key={`custom-${section.id}-${item.id}`}
              className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
              onClick={() =>
                onJumpToSection?.(`custom-${section.id}-${item.id}`)
              }
            >
              <div className="flex items-baseline justify-between">
                <span className={cn(headingTextClass, "text-slate-900")}>
                  {item.title}
                </span>
                {period && (
                  <span className="text-[10px] text-slate-700">{period}</span>
                )}
              </div>
              {item.subtitle && (
                <div className={bodyTextClass}>{item.subtitle}</div>
              )}
              {item.link && (
                <div className="text-[9px] text-slate-500">
                  {cleanUrl(item.link)}
                </div>
              )}
              <HtmlBulletList
                items={item.description || []}
                bodyTextClass={bodyTextClass}
              />
            </div>,
            estimateHeight("customItem", item),
          );
        });
      }
    }
  }

  return <HtmlPageWrapper pages={pages} containerClass={fontClass} />;
}
