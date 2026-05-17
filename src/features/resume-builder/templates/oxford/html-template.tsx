"use client";

import { cn, formatResumeDate } from "@/lib/utils";

import { cleanUrl } from "../_shared/constants";
import { HtmlBulletList } from "../_shared/html-bullet-list";
import { HtmlPageWrapper } from "../_shared/html-page-wrapper";
import { CLICKABLE_CLASS } from "../_shared/html-render-helpers";
import { resolveHtmlStyle } from "../_shared/html-style-resolver";
import { HtmlSummary } from "../_shared/html-summary";
import { createPaginator, estimateHeight } from "../_shared/pagination";
import { resolveTranslations } from "../_shared/translations";
import type { HtmlTemplateProps } from "../types";

/**
 * Oxford template — inspired by the University of Oxford careers CV format:
 *  - Name centered, in blue/teal accent color, larger font
 *  - Contact info centered on one line, pipe-separated
 *  - Full-width rule below the contact line
 *  - Section titles ALL CAPS, bold, left-aligned, with full-width bottom border
 *  - Experience/Education items: all key info on ONE bold line
 *    e.g. "Company, Position Title; Month Year – Month Year"
 *  - Bullet points indented below
 *  - Skills: "Category: value" inline with bold label
 */
export function OxfordHtmlTemplate({
  data,
  onJumpToSection,
}: HtmlTemplateProps) {
  const { personalInfo } = data;
  const { fontClass, bodyTextClass, headingTextClass, densityClasses } =
    resolveHtmlStyle(data.style);
  const translations = resolveTranslations(data.style?.language);

  // Oxford accent — deep blue matching the reference
  const accentColor = "text-[#1a4a8a]";

  // Section title: ALL CAPS, bold, left-aligned, bottom border
  const sectionTitleClass = cn(
    "hover:text-primary cursor-pointer font-bold uppercase tracking-wide text-slate-900 transition-colors border-b border-slate-900 pb-0.5 text-[11px]",
    densityClasses.sectionMt,
    "mb-2",
  );

  // ── Header ──────────────────────────────────────────────────────────────
  const header = (
    <header
      key="header"
      onClick={() => onJumpToSection?.("personal")}
      className={cn("mb-3 flex flex-col items-center text-center", CLICKABLE_CLASS)}
    >
      {/* Name — accent color, larger, bold */}
      <h1 className={cn("text-[18px] font-bold", accentColor)}>
        {personalInfo.fullName || "Full Name"}
      </h1>

      {/* Contact line — pipe-separated, centered */}
      <div className="mt-0.5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-700">
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} className="hover:underline">
            {personalInfo.email}
          </a>
        )}
        {personalInfo.phone && (
          <>
            <span className="text-slate-400">|</span>
            <a href={`tel:${personalInfo.phone}`} className="hover:underline">
              {personalInfo.phone}
            </a>
          </>
        )}
        {personalInfo.location && (
          <>
            <span className="text-slate-400">|</span>
            <span>{personalInfo.location}</span>
          </>
        )}
        {personalInfo.linkedin?.url && (
          <>
            <span className="text-slate-400">|</span>
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
            <span className="text-slate-400">|</span>
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

      {/* Full-width rule below contact */}
      <div className="mt-1.5 h-[1px] w-full bg-slate-900" />
    </header>
  );

  // ── Paginator ────────────────────────────────────────────────────────────
  const paperSize = data.style?.paperSize || "A4";
  const { pages, addToPage } = createPaginator(paperSize);

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
    "education",
    "experience",
    "projects",
    "skills",
    "custom",
  ];

  for (const sectionId of sectionOrder) {
    // ── Education ──────────────────────────────────────────────────────
    if (sectionId === "education" && data.education.length > 0) {
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
        // Build the single bold headline:
        // "Degree Major, Institution; StartYear – EndYear"
        const dateRange = edu.startYear
          ? `${edu.startYear} – ${edu.isCurrentlyStudying ? translations.present : edu.endYear || ""}`
          : edu.endYear || "";

        const headline = [
          [edu.degree, edu.major].filter(Boolean).join(" "),
          edu.institution,
        ]
          .filter(Boolean)
          .join(", ");

        addToPage(
          <div
            key={`edu-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`education-${edu.id}`)}
          >
            {/* Single bold line: Degree + Institution; Date */}
            <div className="flex items-baseline justify-between gap-2">
              <span className={cn(headingTextClass, "text-slate-900 flex-1")}>
                {headline}
                {dateRange && (
                  <span className="font-bold">; {dateRange}</span>
                )}
              </span>
              {edu.location && (
                <span className="shrink-0 text-[10px] text-slate-600">
                  {edu.location}
                </span>
              )}
            </div>
            {edu.gpa && (
              <div className={cn(bodyTextClass, "mt-0.5")}>
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

    // ── Experience ─────────────────────────────────────────────────────
    else if (sectionId === "experience" && data.experience.length > 0) {
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
        // Single bold headline: "Company, Position; Date"
        const dateRange = exp.startDate
          ? `${formatResumeDate(exp.startDate)} – ${exp.isCurrentJob ? translations.present : exp.endDate ? formatResumeDate(exp.endDate) : ""}`
          : "";

        const headline = [exp.company, exp.position]
          .filter(Boolean)
          .join(", ");

        addToPage(
          <div
            key={`exp-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`experience-${exp.id}`)}
          >
            {/* Single bold line: Company, Position; Date */}
            <div className="flex items-baseline justify-between gap-2">
              <span className={cn(headingTextClass, "text-slate-900 flex-1")}>
                {headline}
                {dateRange && (
                  <span className="font-bold">; {dateRange}</span>
                )}
              </span>
              {exp.location && (
                <span className="shrink-0 text-[10px] text-slate-600">
                  {exp.location}
                </span>
              )}
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

    // ── Skills ─────────────────────────────────────────────────────────
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

    // ── Projects ───────────────────────────────────────────────────────
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
        const dateRange = project.startDate
          ? `${formatResumeDate(project.startDate)}${project.endDate ? ` – ${formatResumeDate(project.endDate)}` : ""}`
          : "";

        addToPage(
          <div
            key={`proj-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`projects-${project.id}`)}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className={cn(headingTextClass, "text-slate-900 flex-1")}>
                {project.name}
                {dateRange && <span className="font-bold">; {dateRange}</span>}
              </span>
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

    // ── Certificates / Awards / Publications ───────────────────────────
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
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn(headingTextClass, "text-slate-900 flex-1")}>
                  {item.title}
                  {item.subtitle && <span className="font-bold">, {item.subtitle}</span>}
                  {item.date && (
                    <span className="font-bold">; {formatResumeDate(item.date)}</span>
                  )}
                </span>
              </div>
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

    // ── Custom sections ────────────────────────────────────────────────
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

        section.items.forEach((item) => {
          const period = item.startDate
            ? `${formatResumeDate(item.startDate)} – ${
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
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn(headingTextClass, "text-slate-900 flex-1")}>
                  {item.title}
                  {item.subtitle && (
                    <span className="font-bold">, {item.subtitle}</span>
                  )}
                  {period && <span className="font-bold">; {period}</span>}
                </span>
              </div>
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
