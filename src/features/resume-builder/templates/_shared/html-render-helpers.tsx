"use client";

import { cn, formatResumeDate } from "@/lib/utils";
import type { ResumeContent } from "@/types/resume";

import { cleanUrl } from "./constants";
import { HtmlBulletList } from "./html-bullet-list";
import type { ResumeTranslations } from "./translations";

/**
 * Visual interaction shared by every block in the HTML preview — adds a
 * subtle highlight + dashed outline on hover, signalling clickability.
 */
export const CLICKABLE_CLASS =
  "group/clickable relative cursor-pointer rounded-none transition-all hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-400/60 hover:outline-offset-4";

interface RenderContext {
  translations: ResumeTranslations;
  bodyTextClass: string;
  headingTextClass: string;
  /** Per-template section heading className (varies between templates). */
  sectionTitleClass: string;
  /** Density-driven item margin class (e.g. "mb-3"). */
  itemGapClass: string;
  onJumpToSection?: (sectionId: string) => void;
}

/**
 * Renders the "experience" section title + items. Returns an array of nodes
 * so the caller can pipe each node + its estimated height into its own
 * paginator.
 */
export function renderExperienceSection(
  experience: ResumeContent["experience"],
  ctx: RenderContext,
  options: { titleColorClass?: string } = {},
) {
  const items = experience.map((exp, i) => (
    <div
      key={`exp-${i}`}
      className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
      onClick={() => ctx.onJumpToSection?.(`experience-${exp.id}`)}
    >
      <div className="mb-0.5 flex items-baseline justify-between">
        <h3 className={cn(ctx.headingTextClass, options.titleColorClass)}>
          {exp.position}
          {exp.employmentType && `, ${exp.employmentType}`}
        </h3>
        <span className="text-[10px] font-medium text-slate-500">
          {formatResumeDate(exp.startDate)} —{" "}
          {exp.isCurrentJob
            ? ctx.translations.present
            : exp.endDate
              ? formatResumeDate(exp.endDate)
              : ""}
        </span>
      </div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className={ctx.bodyTextClass}>{exp.company}</span>
        {exp.location && (
          <span className="text-[10px] text-slate-500">{exp.location}</span>
        )}
      </div>
      <HtmlBulletList items={exp.description} bodyTextClass={ctx.bodyTextClass} />
    </div>
  ));

  return {
    title: (
      <h2
        key="exp-title"
        onClick={() => ctx.onJumpToSection?.("experience")}
        className={ctx.sectionTitleClass}
      >
        {ctx.translations.workExperience}
      </h2>
    ),
    items,
  };
}

export function renderEducationSection(
  education: ResumeContent["education"],
  ctx: RenderContext,
) {
  const items = education.map((edu, i) => (
    <div
      key={`edu-${i}`}
      className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
      onClick={() => ctx.onJumpToSection?.(`education-${edu.id}`)}
    >
      <div className="mb-0.5 flex items-baseline justify-between">
        <h3 className={ctx.headingTextClass}>
          {edu.degree}
          {edu.major && `, ${edu.major}`}
        </h3>
        <span className="text-[10px] font-medium text-slate-500">
          {edu.startYear} —{" "}
          {edu.isCurrentlyStudying
            ? ctx.translations.present
            : edu.endYear || ""}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <div className={ctx.bodyTextClass}>{edu.institution}</div>
        {edu.location && (
          <span className="text-[10px] text-slate-500">{edu.location}</span>
        )}
      </div>
      {edu.gpa && (
        <div className="text-[10px] text-slate-500">
          {ctx.translations.gpa}: {edu.gpa}
        </div>
      )}
      {edu.description && (
        <HtmlBulletList
          items={edu.description}
          bodyTextClass={ctx.bodyTextClass}
        />
      )}
    </div>
  ));

  return {
    title: (
      <h2
        key="edu-title"
        onClick={() => ctx.onJumpToSection?.("education")}
        className={ctx.sectionTitleClass}
      >
        {ctx.translations.education}
      </h2>
    ),
    items,
  };
}

export function renderSkillsSection(
  skills: ResumeContent["skills"],
  ctx: RenderContext,
) {
  const items = skills.map((skill, i) => (
    <div
      key={`skill-${i}`}
      className={cn(ctx.itemGapClass, ctx.bodyTextClass, CLICKABLE_CLASS)}
      onClick={() => ctx.onJumpToSection?.(`skills-${skill.id}`)}
    >
      <span className="font-bold">{skill.category}: </span>
      <span className="text-slate-700">{(skill.items || []).join(", ")}</span>
    </div>
  ));

  return {
    title: (
      <h2
        key="skills-title"
        onClick={() => ctx.onJumpToSection?.("skills")}
        className={ctx.sectionTitleClass}
      >
        {ctx.translations.skills}
      </h2>
    ),
    items,
  };
}

export function renderProjectsSection(
  projects: ResumeContent["projects"],
  ctx: RenderContext,
) {
  const items = projects.map((project, i) => (
    <div
      key={`proj-${i}`}
      className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
      onClick={() => ctx.onJumpToSection?.(`projects-${project.id}`)}
    >
      <div className="mb-0.5 flex items-baseline justify-between">
        <h3 className={ctx.headingTextClass}>{project.name}</h3>
        {(project.startDate || project.endDate) && (
          <span className="text-[10px] font-medium text-slate-500">
            {formatResumeDate(project.startDate)}{" "}
            {project.endDate ? `— ${formatResumeDate(project.endDate)}` : ""}
          </span>
        )}
      </div>
      {project.link && (
        <div className="font-mono text-[9px] tracking-tight text-slate-500">
          {cleanUrl(project.link)}
        </div>
      )}
      <HtmlBulletList
        items={project.description}
        bodyTextClass={ctx.bodyTextClass}
      />
    </div>
  ));

  return {
    title: (
      <h2
        key="projects-title"
        onClick={() => ctx.onJumpToSection?.("projects")}
        className={ctx.sectionTitleClass}
      >
        {ctx.translations.projects}
      </h2>
    ),
    items,
  };
}

type ListItem = NonNullable<ResumeContent["certificates"]>[number];

/**
 * Generic renderer for the predefined "items list" sections — certificates,
 * awards, publications. They all share the same shape so we collapse them
 * into one helper.
 */
export function renderItemsListSection(
  kind: "certificates" | "awards" | "publications",
  list: ListItem[] | undefined,
  ctx: RenderContext,
) {
  if (!list || list.length === 0) {
    return { title: null, items: [] as React.ReactNode[] };
  }

  const title = (
    <h2
      key={`${kind}-title`}
      onClick={() => ctx.onJumpToSection?.(kind)}
      className={ctx.sectionTitleClass}
    >
      {ctx.translations[kind]}
    </h2>
  );

  const items = list.map((item, i) => (
    <div
      key={`${kind}-${i}`}
      className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
      onClick={() => ctx.onJumpToSection?.(`${kind}-${item.id}`)}
    >
      <div className="mb-0.5 flex items-baseline justify-between">
        <h3 className={ctx.headingTextClass}>{item.title}</h3>
        {item.date && (
          <span className="text-[10px] font-medium text-slate-500">
            {formatResumeDate(item.date)}
          </span>
        )}
      </div>
      {item.subtitle && <div className={ctx.bodyTextClass}>{item.subtitle}</div>}
      {item.link && (
        <div className="font-mono text-[9px] tracking-tight text-slate-500">
          {cleanUrl(item.link)}
        </div>
      )}
      <HtmlBulletList
        items={item.description}
        bodyTextClass={ctx.bodyTextClass}
      />
    </div>
  ));

  return { title, items };
}

export function renderCustomSections(
  customSections: ResumeContent["customSections"],
  ctx: RenderContext,
) {
  const result: { title: React.ReactNode; items: React.ReactNode[] }[] = [];
  if (!customSections) return result;

  for (const section of customSections) {
    const items: React.ReactNode[] = [];
    for (const item of section.items) {
      // Period rendering: prefer new startDate/endDate fields, fall back
      // to the legacy single `date` field for backward compatibility.
      const period = item.startDate
        ? `${formatResumeDate(item.startDate)} — ${
            item.isCurrent
              ? ctx.translations.present
              : item.endDate
                ? formatResumeDate(item.endDate)
                : ""
          }`
        : item.date
          ? formatResumeDate(item.date)
          : "";

      items.push(
        <div
          key={`custom-${section.id}-${item.id}`}
          className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
          onClick={() =>
            ctx.onJumpToSection?.(`custom-${section.id}-${item.id}`)
          }
        >
          <div className="mb-0.5 flex items-baseline justify-between">
            <h3 className={ctx.headingTextClass}>{item.title}</h3>
            {period && (
              <span className="text-[10px] font-medium text-slate-500">
                {period}
              </span>
            )}
          </div>
          {item.subtitle && (
            <div className={ctx.bodyTextClass}>{item.subtitle}</div>
          )}
          {item.link && (
            <div className="font-mono text-[9px] tracking-tight text-slate-500">
              {cleanUrl(item.link)}
            </div>
          )}
          <HtmlBulletList
            items={item.description}
            bodyTextClass={ctx.bodyTextClass}
          />
        </div>,
      );
    }

    result.push({
      title: (
        <h2
          key={`custom-title-${section.id}`}
          onClick={() => ctx.onJumpToSection?.(`custom-${section.id}`)}
          className={ctx.sectionTitleClass}
        >
          {section.title}
        </h2>
      ),
      items,
    });
  }

  return result;
}
