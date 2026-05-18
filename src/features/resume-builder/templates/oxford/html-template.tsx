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
 * Oxford template — University of Oxford careers CV format:
 *  - Name centered, larger font, black
 *  - Contact info centered, pipe-separated
 *  - Full-width rule below contact
 *  - Section titles: BOLD UPPERCASE, left-aligned, rule ABOVE (not below)
 *  - Experience: "Position, Company" (bold) + date right; second line for dept
 *  - Education: "Degree, Institution" (bold) + date right; detail below
 *  - Skills: bullet list directly under section title
 */
export function OxfordHtmlTemplate({
  data,
  onJumpToSection,
}: HtmlTemplateProps) {
  const { personalInfo } = data;
  const { fontClass, bodyTextClass, headingTextClass, densityClasses } =
    resolveHtmlStyle(data.style);
  const translations = resolveTranslations(data.style?.language);
  // Oxford default: uppercase (sesuai format Oxford OCS)
  const uppercaseHeaders = data.style?.uppercaseHeaders ?? true;

  // Section title: bold, uppercase, left-aligned, border TOP
  const sectionTitleClass = cn(
    "hover:text-primary cursor-pointer font-bold text-black transition-colors border-t border-black pt-1 text-[11px]",
    densityClasses.sectionMt,
    "mb-2",
    uppercaseHeaders ? "uppercase" : "normal-case",
  );

  // ── Header ──────────────────────────────────────────────────────────────
  const header = (
    <header
      key="header"
      onClick={() => onJumpToSection?.("personal")}
      className={cn("mb-3 flex flex-col items-center text-center", CLICKABLE_CLASS)}
    >
      {/* Name — larger, bold, black */}
      <h1 className="text-[18px] font-bold text-black">
        {personalInfo.fullName || "Full Name"}
      </h1>

      {/* Contact line — pipe-separated, centered */}
      <div className="mt-0.5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[10px] text-black">
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:underline">
            {personalInfo.email}
          </a>
        )}
        {personalInfo.phone && (
          <>
            <span>|</span>
            <a href={`tel:${personalInfo.phone}`} className="text-blue-600 hover:underline">
              {personalInfo.phone}
            </a>
          </>
        )}
        {personalInfo.location && (
          <>
            <span>|</span>
            <span>{personalInfo.location}</span>
          </>
        )}
        {personalInfo.linkedin?.url && (
          <>
            <span>|</span>
            <a
              href={personalInfo.linkedin.url}
              className="text-blue-600 hover:underline"
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
            <span>|</span>
            <a
              href={personalInfo.website.url}
              className="text-blue-600 hover:underline"
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
    "experience",
    "education",
    "projects",
    "skills",
    "custom",
  ];

  for (const sectionId of sectionOrder) {
    // ── Experience ─────────────────────────────────────────────────────
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
        const dateRange = exp.startDate
          ? `${formatResumeDate(exp.startDate)} – ${exp.isCurrentJob ? translations.present : exp.endDate ? formatResumeDate(exp.endDate) : ""}`
          : "";

        addToPage(
          <div
            key={`exp-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`experience-${exp.id}`)}
          >
            {/* Row 1: Position, Company — Date + Location */}
            <div className="flex items-start justify-between gap-2">
              <span className={cn(headingTextClass, "text-black")}>
                {exp.position}
                {exp.company && `, ${exp.company}`}
              </span>
              <div className="shrink-0 text-right">
                {dateRange && (
                  <div className="text-[10px] font-bold text-black">
                    {dateRange}
                  </div>
                )}
                {exp.location && (
                  <div className="text-[10px] text-black">
                    {exp.location}
                  </div>
                )}
              </div>
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

    // ── Education ──────────────────────────────────────────────────────
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
        const dateRange = edu.startYear
          ? `${edu.startYear}–${edu.isCurrentlyStudying ? translations.present : edu.endYear || ""}`
          : edu.endYear || "";

        addToPage(
          <div
            key={`edu-${i}`}
            className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
            onClick={() => onJumpToSection?.(`education-${edu.id}`)}
          >
            {/* Row 1: Degree, Institution — Date + Location */}
            <div className="flex items-start justify-between gap-2">
              <span className={cn(headingTextClass, "text-black")}>
                {[edu.degree, edu.major].filter(Boolean).join(" ")}
                {edu.institution && `, ${edu.institution}`}
              </span>
              <div className="shrink-0 text-right">
                {dateRange && (
                  <div className="text-[10px] font-bold text-black">
                    {dateRange}
                  </div>
                )}
                {edu.location && (
                  <div className="text-[10px] text-black">
                    {edu.location}
                  </div>
                )}
              </div>
            </div>
            {/* Row 2: GPA or additional info */}
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
              <span className={cn(headingTextClass, "text-black")}>
                {project.name}
              </span>
              {dateRange && (
                <span className="shrink-0 text-[10px] font-bold text-black">
                  {dateRange}
                </span>
              )}
            </div>
            {project.link && (
              <div className="text-[9px] text-blue-600">
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
                <span className={cn(headingTextClass, "text-black")}>
                  {item.title}
                  {item.subtitle && `, ${item.subtitle}`}
                </span>
                {item.date && (
                  <span className="shrink-0 text-[10px] font-bold text-black">
                    {formatResumeDate(item.date)}
                  </span>
                )}
              </div>
              {item.link && (
                <div className="text-[9px] text-blue-600">
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
        if (section.items.length === 0) continue;

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
                <span className={cn(headingTextClass, "text-black")}>
                  {item.title}
                  {item.subtitle && `, ${item.subtitle}`}
                </span>
                {period && (
                  <span className="shrink-0 text-[10px] font-bold text-black">
                    {period}
                  </span>
                )}
              </div>
              {item.link && (
                <div className="text-[9px] text-blue-600">
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
