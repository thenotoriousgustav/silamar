"use client";

import type { ReactNode } from "react";

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

/**
 * Context passed by the engine to every section renderer. Templates configure
 * this once when calling `renderHtmlPages` — the engine forwards it to each
 * helper so they don't need access to the `ResumeStyle` directly.
 */
export interface RenderContext {
  translations: ResumeTranslations;
  bodyTextClass: string;
  headingTextClass: string;
  /** Per-template section heading className (varies between templates). */
  sectionTitleClass: string;
  /** Density-driven item margin class (e.g. "mb-3"). */
  itemGapClass: string;
  /** Optional accent color class applied to item primary titles. */
  titleColorClass?: string;
  onJumpToSection?: (sectionId: string) => void;
}

/**
 * Shape returned by every section renderer. The engine uses this to pair
 * each rendered item with the raw data needed for height estimation —
 * decoupling the renderer from the engine's pagination logic.
 */
export interface RenderedSection<TItem> {
  title: ReactNode;
  items: Array<{ node: ReactNode; raw: TItem }>;
}

// ─── Small presentational subparts ─────────────────────────────────────────

interface TitleDateRowProps {
  title: ReactNode;
  date?: ReactNode;
  headingTextClass: string;
  titleColorClass?: string;
}

/** Title (left) + date (right), baseline-aligned — used by most item layouts. */
function TitleDateRow({
  title,
  date,
  headingTextClass,
  titleColorClass,
}: TitleDateRowProps) {
  return (
    <div className="mb-0.5 flex items-baseline justify-between">
      <h3 className={cn(headingTextClass, titleColorClass)}>{title}</h3>
      {date && (
        <span className="text-[10px] font-medium text-slate-500">{date}</span>
      )}
    </div>
  );
}

interface SubtitleLocationRowProps {
  subtitle?: ReactNode;
  location?: string;
  bodyTextClass: string;
}

/** Subtitle (left) + location (right), used as the second row of an item. */
function SubtitleLocationRow({
  subtitle,
  location,
  bodyTextClass,
}: SubtitleLocationRowProps) {
  if (!subtitle && !location) return null;
  return (
    <div className="mb-1 flex items-baseline justify-between">
      <div className={bodyTextClass}>{subtitle}</div>
      {location && (
        <span className="text-[10px] text-slate-500">{location}</span>
      )}
    </div>
  );
}

/** Compact link line shown under project / certificate / publication items. */
function LinkLine({ href }: { href: string }) {
  return (
    <div className="font-mono text-[9px] tracking-tight text-slate-500">
      {cleanUrl(href)}
    </div>
  );
}

/** Builds a "<h2>" section title bound to a click handler. */
function sectionTitle(
  key: string,
  text: string,
  jumpId: string,
  ctx: RenderContext,
): ReactNode {
  return (
    <h2
      key={key}
      onClick={() => ctx.onJumpToSection?.(jumpId)}
      className={ctx.sectionTitleClass}
    >
      {text}
    </h2>
  );
}

// ─── Date formatting helpers ──────────────────────────────────────────────

function formatRange(
  start: string | undefined,
  end: string | undefined,
  isCurrent: boolean | undefined,
  presentLabel: string,
): string {
  if (!start && !end) return "";
  const left = start ? formatResumeDate(start) : "";
  const right = isCurrent ? presentLabel : end ? formatResumeDate(end) : "";
  if (!left) return right;
  if (!right) return left;
  return `${left} — ${right}`;
}

// ─── Section renderers ────────────────────────────────────────────────────

type Experience = ResumeContent["experience"][number];
type Education = ResumeContent["education"][number];
type Skill = ResumeContent["skills"][number];
type Project = ResumeContent["projects"][number];
type ListItem = NonNullable<ResumeContent["certificates"]>[number];
type CustomItem = NonNullable<
  ResumeContent["customSections"]
>[number]["items"][number];

export function renderExperienceSection(
  experience: Experience[],
  ctx: RenderContext,
): RenderedSection<Experience> {
  const items = experience.map((exp) => ({
    raw: exp,
    node: (
      <div
        key={`exp-${exp.id}`}
        className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
        onClick={() => ctx.onJumpToSection?.(`experience-${exp.id}`)}
      >
        <TitleDateRow
          headingTextClass={ctx.headingTextClass}
          titleColorClass={ctx.titleColorClass}
          title={
            <>
              {exp.position}
              {exp.employmentType && `, ${exp.employmentType}`}
            </>
          }
          date={formatRange(
            exp.startDate,
            exp.endDate,
            exp.isCurrentJob,
            ctx.translations.present,
          )}
        />
        <SubtitleLocationRow
          bodyTextClass={ctx.bodyTextClass}
          subtitle={exp.company}
          location={exp.location}
        />
        <HtmlBulletList
          items={exp.description}
          bodyTextClass={ctx.bodyTextClass}
        />
      </div>
    ),
  }));

  return {
    title: sectionTitle(
      "exp-title",
      ctx.translations.workExperience,
      "experience",
      ctx,
    ),
    items,
  };
}

export function renderEducationSection(
  education: Education[],
  ctx: RenderContext,
): RenderedSection<Education> {
  const items = education.map((edu) => ({
    raw: edu,
    node: (
      <div
        key={`edu-${edu.id}`}
        className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
        onClick={() => ctx.onJumpToSection?.(`education-${edu.id}`)}
      >
        <TitleDateRow
          headingTextClass={ctx.headingTextClass}
          title={
            <>
              {edu.degree}
              {edu.major && `, ${edu.major}`}
            </>
          }
          date={
            edu.startYear
              ? `${edu.startYear} — ${
                  edu.isCurrentlyStudying
                    ? ctx.translations.present
                    : edu.endYear || ""
                }`
              : edu.endYear || ""
          }
        />
        <SubtitleLocationRow
          bodyTextClass={ctx.bodyTextClass}
          subtitle={edu.institution}
          location={edu.location}
        />
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
    ),
  }));

  return {
    title: sectionTitle(
      "edu-title",
      ctx.translations.education,
      "education",
      ctx,
    ),
    items,
  };
}

export function renderSkillsSection(
  skills: Skill[],
  ctx: RenderContext,
): RenderedSection<Skill> {
  const items = skills.map((skill) => ({
    raw: skill,
    node: (
      <div
        key={`skill-${skill.id}`}
        className={cn(ctx.itemGapClass, ctx.bodyTextClass, CLICKABLE_CLASS)}
        onClick={() => ctx.onJumpToSection?.(`skills-${skill.id}`)}
      >
        <span className="font-bold">{skill.category}: </span>
        <span className="text-slate-700">{(skill.items || []).join(", ")}</span>
      </div>
    ),
  }));

  return {
    title: sectionTitle("skills-title", ctx.translations.skills, "skills", ctx),
    items,
  };
}

export function renderProjectsSection(
  projects: Project[],
  ctx: RenderContext,
): RenderedSection<Project> {
  const items = projects.map((project) => ({
    raw: project,
    node: (
      <div
        key={`proj-${project.id}`}
        className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
        onClick={() => ctx.onJumpToSection?.(`projects-${project.id}`)}
      >
        <TitleDateRow
          headingTextClass={ctx.headingTextClass}
          title={project.name}
          date={
            project.startDate || project.endDate
              ? `${formatResumeDate(project.startDate)} ${
                  project.endDate ? `— ${formatResumeDate(project.endDate)}` : ""
                }`.trim()
              : undefined
          }
        />
        {project.link && <LinkLine href={project.link} />}
        <HtmlBulletList
          items={project.description}
          bodyTextClass={ctx.bodyTextClass}
        />
      </div>
    ),
  }));

  return {
    title: sectionTitle(
      "projects-title",
      ctx.translations.projects,
      "projects",
      ctx,
    ),
    items,
  };
}

/**
 * Generic renderer for the predefined "items list" sections — certificates,
 * awards, publications. They all share the same shape so we collapse them
 * into one helper.
 */
export function renderItemsListSection(
  kind: "certificates" | "awards" | "publications",
  list: ListItem[] | undefined,
  ctx: RenderContext,
): RenderedSection<ListItem> {
  if (!list || list.length === 0) {
    return { title: null, items: [] };
  }

  const items = list.map((item) => ({
    raw: item,
    node: (
      <div
        key={`${kind}-${item.id}`}
        className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
        onClick={() => ctx.onJumpToSection?.(`${kind}-${item.id}`)}
      >
        <TitleDateRow
          headingTextClass={ctx.headingTextClass}
          title={item.title}
          date={item.date ? formatResumeDate(item.date) : undefined}
        />
        {item.subtitle && (
          <div className={ctx.bodyTextClass}>{item.subtitle}</div>
        )}
        {item.link && <LinkLine href={item.link} />}
        <HtmlBulletList
          items={item.description}
          bodyTextClass={ctx.bodyTextClass}
        />
      </div>
    ),
  }));

  return {
    title: sectionTitle(
      `${kind}-title`,
      ctx.translations[kind],
      kind,
      ctx,
    ),
    items,
  };
}

export interface RenderedCustomSection {
  title: ReactNode;
  items: Array<{ node: ReactNode; raw: CustomItem }>;
}

/**
 * Returns one `RenderedCustomSection` per non-empty custom section. Sections
 * with no items are filtered out so the engine never produces an orphan
 * title.
 */
export function renderCustomSections(
  customSections: ResumeContent["customSections"],
  ctx: RenderContext,
): RenderedCustomSection[] {
  if (!customSections) return [];

  return customSections
    .filter((section) => section.items.length > 0)
    .map((section) => ({
      title: (
        <h2
          key={`custom-title-${section.id}`}
          onClick={() => ctx.onJumpToSection?.(`custom-${section.id}`)}
          className={ctx.sectionTitleClass}
        >
          {section.title}
        </h2>
      ),
      items: section.items.map((item) => ({
        raw: item,
        node: (
          <div
            key={`custom-${section.id}-${item.id}`}
            className={cn(ctx.itemGapClass, CLICKABLE_CLASS)}
            onClick={() =>
              ctx.onJumpToSection?.(`custom-${section.id}-${item.id}`)
            }
          >
            <TitleDateRow
              headingTextClass={ctx.headingTextClass}
              title={item.title}
              date={
                item.startDate
                  ? formatRange(
                      item.startDate,
                      item.endDate,
                      item.isCurrent,
                      ctx.translations.present,
                    )
                  : item.date
                    ? formatResumeDate(item.date)
                    : undefined
              }
            />
            {item.subtitle && (
              <div className={ctx.bodyTextClass}>{item.subtitle}</div>
            )}
            {item.link && <LinkLine href={item.link} />}
            <HtmlBulletList
              items={item.description}
              bodyTextClass={ctx.bodyTextClass}
            />
          </div>
        ),
      })),
    }));
}
