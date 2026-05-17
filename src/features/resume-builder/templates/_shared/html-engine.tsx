"use client";

import type { ReactNode } from "react";

import type { ResumeContent } from "@/types/resume";

import {
  type RenderContext,
  type RenderedSection,
  renderCustomSections,
  renderEducationSection,
  renderExperienceSection,
  renderItemsListSection,
  renderProjectsSection,
  renderSkillsSection,
} from "./html-render-helpers";
import { HtmlSummary } from "./html-summary";
import { createPaginator, estimateHeight } from "./pagination";
import type { ResumeTranslations } from "./translations";

/** Section keys handled by the default engine. */
type SectionId =
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certificates"
  | "awards"
  | "publications"
  | "custom";

const DEFAULT_SECTION_ORDER: SectionId[] = [
  "experience",
  "education",
  "projects",
  "skills",
  "custom",
];

export interface HtmlEngineConfig {
  data: ResumeContent;
  translations: ResumeTranslations;
  bodyTextClass: string;
  headingTextClass: string;
  /** Per-template section title className (varies between templates). */
  sectionTitleClass: string;
  /** Density-driven item margin class (e.g. "mb-3"). */
  itemGapClass: string;
  /**
   * Optional accent color class applied to item titles (experience position,
   * project name, etc.). Templates use this to highlight primary headings.
   */
  experienceTitleColorClass?: string;
  /** Custom-rendered header element supplied by the template. */
  headerElement: ReactNode;
  onJumpToSection?: (sectionId: string) => void;
}

/**
 * Walks `data.sectionOrder` and emits the paginated array of nodes for the
 * HTML preview. Templates only have to:
 *  1. Build their own header element.
 *  2. Provide a `sectionTitleClass` that captures their visual identity.
 *  3. Feed both into this engine.
 *
 * The engine guarantees:
 *  - Section titles are never orphaned at the bottom of a page (titles are
 *    paginated atomically with their first item).
 *  - Empty sections (and empty custom subsections) never produce a stray
 *    title.
 *  - Pagination & section ordering stay consistent across every template.
 */
export function renderHtmlPages(config: HtmlEngineConfig): ReactNode[][] {
  const {
    data,
    headerElement,
    onJumpToSection,
    experienceTitleColorClass,
  } = config;

  const paperSize = data.style?.paperSize || "A4";
  const { pages, addToPage, addAtomic } = createPaginator(paperSize);

  const ctx: RenderContext = {
    translations: config.translations,
    bodyTextClass: config.bodyTextClass,
    headingTextClass: config.headingTextClass,
    sectionTitleClass: config.sectionTitleClass,
    itemGapClass: config.itemGapClass,
    titleColorClass: experienceTitleColorClass,
    onJumpToSection,
  };

  // ─── Header ────────────────────────────────────────────────────────────
  addToPage(headerElement, estimateHeight("header", null));

  // ─── Summary ───────────────────────────────────────────────────────────
  if (data.personalInfo.summary) {
    addToPage(
      <HtmlSummary
        summary={data.personalInfo.summary}
        bodyTextClass={config.bodyTextClass}
        sectionTitleClass={config.sectionTitleClass}
        translations={config.translations}
        onJumpToSection={onJumpToSection}
      />,
      estimateHeight("summary", data.personalInfo.summary),
    );
  }

  // ─── Body sections ─────────────────────────────────────────────────────
  const sectionOrder = (data.sectionOrder ??
    DEFAULT_SECTION_ORDER) as SectionId[];

  for (const id of sectionOrder) {
    renderSection(id, data, ctx, addAtomic);
  }

  return pages;
}

// ─── Section dispatch ─────────────────────────────────────────────────────

type AddAtomic = ReturnType<typeof createPaginator>["addAtomic"];

/**
 * Resolves a section id to its rendered output, then commits it through the
 * paginator. Empty sections are no-ops so the engine never produces an
 * orphan title.
 */
function renderSection(
  id: SectionId,
  data: ResumeContent,
  ctx: RenderContext,
  addAtomic: AddAtomic,
): void {
  switch (id) {
    case "experience":
      if (data.experience.length === 0) return;
      commitSection(
        renderExperienceSection(data.experience, ctx),
        "experienceItem",
        addAtomic,
      );
      return;

    case "education":
      if (data.education.length === 0) return;
      commitSection(
        renderEducationSection(data.education, ctx),
        "educationItem",
        addAtomic,
      );
      return;

    case "skills":
      if (data.skills.length === 0) return;
      commitSection(
        renderSkillsSection(data.skills, ctx),
        "skillItem",
        addAtomic,
      );
      return;

    case "projects":
      if (data.projects.length === 0) return;
      commitSection(
        renderProjectsSection(data.projects, ctx),
        "projectItem",
        addAtomic,
      );
      return;

    case "certificates":
    case "awards":
    case "publications": {
      const list = data[id];
      if (!list || list.length === 0) return;
      commitSection(
        renderItemsListSection(id, list, ctx),
        `${id}Item`,
        addAtomic,
      );
      return;
    }

    case "custom": {
      const sections = renderCustomSections(data.customSections, ctx);
      for (const section of sections) {
        commitSection(section, "customItem", addAtomic);
      }
      return;
    }
  }
}

/**
 * Sends a `RenderedSection` (title + items) through the paginator, keeping
 * the title attached to its first item so titles never end up alone at the
 * bottom of a page.
 */
function commitSection<T>(
  section: RenderedSection<T> | { title: ReactNode | null; items: [] },
  itemKind: string,
  addAtomic: AddAtomic,
): void {
  if (!section.title || section.items.length === 0) return;

  const titleHeight = estimateHeight("sectionTitle", null);
  const [first, ...rest] = section.items;

  // Title + first item are an atomic block: they always start on the same
  // page, even if it means breaking a new page early.
  addAtomic([
    { node: section.title, height: titleHeight },
    { node: first.node, height: estimateHeight(itemKind, first.raw) },
  ]);

  for (const item of rest) {
    addAtomic([{ node: item.node, height: estimateHeight(itemKind, item.raw) }]);
  }
}
