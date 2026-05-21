"use client";

import { cn, formatResumeDate } from "@/lib/utils";

import { cleanUrl } from "../_shared/constants";
import { HtmlBulletList } from "../_shared/html-bullet-list";
import { HtmlPageWrapper } from "../_shared/html-page-wrapper";
import { CLICKABLE_CLASS } from "../_shared/html-render-helpers";
import { resolveHtmlStyle } from "../_shared/html-style-resolver";
import { HtmlSummary } from "../_shared/html-summary";
import type { ResumeBlock } from "../_shared/pagination";
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
  // Harvard default: not uppercase (centered bold only)
  const uppercaseHeaders = data.style?.uppercaseHeaders ?? false;

  // Section title: bold, centered, no border — pure Harvard style
  const sectionTitleClass = cn(
    "hover:text-primary cursor-pointer font-bold text-center text-black transition-colors text-[11px]",
    densityClasses.sectionMt,
    densityClasses.sectionGap,
    uppercaseHeaders ? "uppercase tracking-wide" : "normal-case",
  );

  // ── Header ──────────────────────────────────────────────────────────────
  const header = (
    <header
      key="header"
      onClick={() => onJumpToSection?.("personal")}
      className={cn(
        "mb-3 flex flex-col items-center text-center",
        CLICKABLE_CLASS,
      )}
    >
      {/* Name — bold, underlined, not uppercase */}
      <h1 className="text-[14px] font-bold text-black underline decoration-slate-900 underline-offset-2">
        {personalInfo.fullName || "Firstname Lastname"}
      </h1>

      {/* Full-width rule immediately below name */}
      <div className="mt-1 h-[1px] w-full bg-slate-900" />

      {/* Contact line — centered, bullet-separated */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-[10px] text-black">
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.location && personalInfo.email && (
          <span className="text-black">•</span>
        )}
        {personalInfo.email && (
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-blue-600 hover:underline"
          >
            {personalInfo.email}
          </a>
        )}
        {personalInfo.phone && (
          <>
            <span className="text-black">•</span>
            <a
              href={`tel:${personalInfo.phone}`}
              className="text-blue-600 hover:underline"
            >
              {personalInfo.phone}
            </a>
          </>
        )}
        {personalInfo.linkedin?.url && (
          <>
            <span className="text-black">•</span>
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
            <span className="text-black">•</span>
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
    </header>
  );

  // ── Build flat blocks list ──────────────────────────────────────────────
  const blocks: ResumeBlock[] = [{ id: "header", node: header }];

  if (personalInfo.summary) {
    blocks.push({
      id: "summary",
      node: (
        <HtmlSummary
          summary={personalInfo.summary}
          bodyTextClass={bodyTextClass}
          sectionTitleClass={sectionTitleClass}
          translations={translations}
          onJumpToSection={onJumpToSection}
        />
      ),
    });
  }

  const sectionOrder = data.sectionOrder || [
    "experience",
    "education",
    "projects",
    "skills",
    "custom",
  ];

  /** Helper — pushes a section title that won't break away from its first item. */
  const pushTitle = (id: string, label: string, jumpId: string) => {
    blocks.push({
      id,
      keepWithNext: true,
      node: (
        <h2
          onClick={() => onJumpToSection?.(jumpId)}
          className={sectionTitleClass}
        >
          {label}
        </h2>
      ),
    });
  };

  for (const sectionId of sectionOrder) {
    // ── Experience ──────────────────────────────────────────────────────
    if (sectionId === "experience" && data.experience.length > 0) {
      pushTitle("exp-title", translations.workExperience, "experience");

      data.experience.forEach((exp, i) => {
        blocks.push({
          id: `exp-${i}`,
          node: (
            <div
              className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
              onClick={() => onJumpToSection?.(`experience-${exp.id}`)}
            >
              {/* Row 1: Organization (bold) — Location */}
              <div className="flex items-baseline justify-between">
                <span className={cn(headingTextClass, "text-black")}>
                  {exp.company}
                </span>
                {exp.location && (
                  <span className="text-[10px] text-black">{exp.location}</span>
                )}
              </div>
              {/* Row 2: Position Title (bold) — Date range */}
              <div className="flex items-baseline justify-between">
                <span className={cn(headingTextClass, "text-black")}>
                  {exp.position}
                  {exp.employmentType && `, ${exp.employmentType}`}
                </span>
                <span className="text-[10px] text-black">
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
            </div>
          ),
        });
      });
    }

    // ── Education ───────────────────────────────────────────────────────
    else if (sectionId === "education" && data.education.length > 0) {
      pushTitle("edu-title", translations.education, "education");

      data.education.forEach((edu, i) => {
        blocks.push({
          id: `edu-${i}`,
          node: (
            <div
              className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
              onClick={() => onJumpToSection?.(`education-${edu.id}`)}
            >
              {/* Row 1: Institution (bold) — Location */}
              <div className="flex items-baseline justify-between">
                <span className={cn(headingTextClass, "text-black")}>
                  {edu.institution}
                </span>
                {edu.location && (
                  <span className="text-[10px] text-black">{edu.location}</span>
                )}
              </div>
              {/* Row 2: Degree + Major — Date range */}
              <div className="flex items-baseline justify-between">
                <span className={cn(bodyTextClass, "text-black")}>
                  {edu.degree}
                  {edu.major && `, ${edu.major}`}
                </span>
                <span className="text-[10px] text-black">
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
            </div>
          ),
        });
      });
    }

    // ── Skills ──────────────────────────────────────────────────────────
    else if (sectionId === "skills" && data.skills.length > 0) {
      pushTitle("skills-title", translations.skills, "skills");

      data.skills.forEach((skill, i) => {
        blocks.push({
          id: `skill-${i}`,
          node: (
            <div
              className={cn(bodyTextClass, CLICKABLE_CLASS)}
              onClick={() => onJumpToSection?.(`skills-${skill.id}`)}
            >
              <span className="font-bold">{skill.category}: </span>
              <span>{(skill.items || []).join(", ")}</span>
            </div>
          ),
        });
      });
    }

    // ── Projects ────────────────────────────────────────────────────────
    else if (sectionId === "projects" && data.projects.length > 0) {
      pushTitle("proj-title", translations.projects, "projects");

      data.projects.forEach((project, i) => {
        blocks.push({
          id: `proj-${i}`,
          node: (
            <div
              className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
              onClick={() => onJumpToSection?.(`projects-${project.id}`)}
            >
              <div className="flex items-baseline justify-between">
                <span className={cn(headingTextClass, "text-black")}>
                  {project.name}
                </span>
                {(project.startDate || project.endDate) && (
                  <span className="text-[10px] text-black">
                    {formatResumeDate(project.startDate)}{" "}
                    {project.endDate
                      ? `— ${formatResumeDate(project.endDate)}`
                      : ""}
                  </span>
                )}
              </div>
              {project.link && (
                <div className="text-[9px] text-black">
                  {cleanUrl(project.link)}
                </div>
              )}
              <HtmlBulletList
                items={project.description}
                bodyTextClass={bodyTextClass}
              />
            </div>
          ),
        });
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
        pushTitle(`${sectionId}-title`, titleText, sectionId);

        list.forEach((item, i) => {
          blocks.push({
            id: `${sectionId}-${i}`,
            node: (
              <div
                className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
                onClick={() => onJumpToSection?.(`${sectionId}-${item.id}`)}
              >
                <div className="flex items-baseline justify-between">
                  <span className={cn(headingTextClass, "text-black")}>
                    {item.title}
                  </span>
                  {item.date && (
                    <span className="text-[10px] text-black">
                      {formatResumeDate(item.date)}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <div className={bodyTextClass}>{item.subtitle}</div>
                )}
                {item.link && (
                  <div className="text-[9px] text-black">
                    {cleanUrl(item.link)}
                  </div>
                )}
                <HtmlBulletList
                  items={item.description}
                  bodyTextClass={bodyTextClass}
                />
              </div>
            ),
          });
        });
      }
    }

    // ── Custom sections ─────────────────────────────────────────────────
    else if (sectionId === "custom" && data.customSections?.length) {
      for (const section of data.customSections) {
        if (section.items.length === 0) continue;

        pushTitle(
          `custom-title-${section.id}`,
          section.title,
          `custom-${section.id}`,
        );

        section.items.forEach((item) => {
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

          blocks.push({
            id: `custom-${section.id}-${item.id}`,
            node: (
              <div
                className={cn(densityClasses.itemGap, CLICKABLE_CLASS)}
                onClick={() =>
                  onJumpToSection?.(`custom-${section.id}-${item.id}`)
                }
              >
                <div className="flex items-baseline justify-between">
                  <span className={cn(headingTextClass, "text-black")}>
                    {item.title}
                  </span>
                  {period && (
                    <span className="text-[10px] text-black">{period}</span>
                  )}
                </div>
                {item.subtitle && (
                  <div className={bodyTextClass}>{item.subtitle}</div>
                )}
                {item.link && (
                  <div className="text-[9px] text-black">
                    {cleanUrl(item.link)}
                  </div>
                )}
                <HtmlBulletList
                  items={item.description || []}
                  bodyTextClass={bodyTextClass}
                />
              </div>
            ),
          });
        });
      }
    }
  }

  return (
    <HtmlPageWrapper
      blocks={blocks}
      containerClass={fontClass}
      paperSize={data.style?.paperSize || "A4"}
      padding={{ horizontal: 50, vertical: 45 }}
    />
  );
}
