"use client";

import type { ReactNode } from "react";

import type { ResumeContent } from "@/types/resume";

import {
  type RenderContext,
  renderCustomSections,
  type RenderedSection,
  renderEducationSection,
  renderExperienceSection,
  renderItemsListSection,
  renderProjectsSection,
  renderSkillsSection,
} from "./html-render-helpers";
import { HtmlSummary } from "./html-summary";
import type { ResumeBlock } from "./pagination";
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
 * Builds the flat array of `ResumeBlock`s the engine emits in document order.
 * The wrapper (`HtmlPageWrapper`) measures and paginates them.
 *
 * Section titles are flagged `keepWithNext: true` so they always paginate
 * together with their first item — preventing orphan titles at the bottom
 * of a page.
 */
export function renderResumeBlocks(config: HtmlEngineConfig): ResumeBlock[] {
  const {
    data,
    headerElement,
    onJumpToSection,
    experienceTitleColorClass,
  } = config;

  const blocks: ResumeBlock[] = [];

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
  blocks.push({ id: "header", node: headerElement });

  // ─── Summary ───────────────────────────────────────────────────────────
  if (data.personalInfo.summary) {
    blocks.push({
      id: "summary",
      node: (
        <HtmlSummary
          summary={data.personalInfo.summary}
          bodyTextClass={config.bodyTextClass}
          sectionTitleClass={config.sectionTitleClass}
          translations={config.translations}
          onJumpToSection={onJumpToSection}
        />
      ),
    });
  }

  // ─── Body sections ─────────────────────────────────────────────────────
  const sectionOrder = (data.sectionOrder ??
    DEFAULT_SECTION_ORDER) as SectionId[];

  for (const id of sectionOrder) {
    pushSection(id, data, ctx, blocks);
  }

  return blocks;
}

// ─── Section dispatch ─────────────────────────────────────────────────────

function pushSection(
  id: SectionId,
  data: ResumeContent,
  ctx: RenderContext,
  blocks: ResumeBlock[],
): void {
  switch (id) {
    case "experience":
      if (data.experience.length === 0) return;
      pushRenderedSection(
        renderExperienceSection(data.experience, ctx),
        `exp`,
        blocks,
      );
      return;

    case "education":
      if (data.education.length === 0) return;
      pushRenderedSection(
        renderEducationSection(data.education, ctx),
        `edu`,
        blocks,
      );
      return;

    case "skills":
      if (data.skills.length === 0) return;
      pushRenderedSection(
        renderSkillsSection(data.skills, ctx),
        `skill`,
        blocks,
      );
      return;

    case "projects":
      if (data.projects.length === 0) return;
      pushRenderedSection(
        renderProjectsSection(data.projects, ctx),
        `proj`,
        blocks,
      );
      return;

    case "certificates":
    case "awards":
    case "publications": {
      const list = data[id];
      if (!list || list.length === 0) return;
      pushRenderedSection(
        renderItemsListSection(id, list, ctx),
        id,
        blocks,
      );
      return;
    }

    case "custom": {
      const sections = renderCustomSections(data.customSections, ctx);
      sections.forEach((section, sIdx) => {
        pushRenderedSection(section, `custom-${sIdx}`, blocks);
      });
      return;
    }
  }
}

/**
 * Pushes a `RenderedSection` (title + items) into the blocks list.
 * The title is flagged `keepWithNext` so it never separates from its first
 * item across a page break.
 */
function pushRenderedSection<T>(
  section: RenderedSection<T> | { title: ReactNode | null; items: [] },
  idPrefix: string,
  blocks: ResumeBlock[],
): void {
  if (!section.title || section.items.length === 0) return;

  blocks.push({
    id: `${idPrefix}-title`,
    node: section.title,
    keepWithNext: true,
  });

  section.items.forEach((item, idx) => {
    blocks.push({ id: `${idPrefix}-${idx}`, node: item.node });
  });
}
