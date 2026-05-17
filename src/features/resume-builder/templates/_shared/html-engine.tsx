"use client";

import type { ReactNode } from "react";

import type { ResumeContent } from "@/types/resume";

import {
  renderCustomSections,
  renderEducationSection,
  renderExperienceSection,
  renderItemsListSection,
  renderProjectsSection,
  renderSkillsSection,
} from "./html-render-helpers";
import { HtmlSummary } from "./html-summary";
import { contentHeightLimitFor, estimateHeight } from "./pagination";
import type { ResumeTranslations } from "./translations";

export interface HtmlEngineConfig {
  data: ResumeContent;
  translations: ResumeTranslations;
  bodyTextClass: string;
  headingTextClass: string;
  /** Per-template section title className (varies between templates). */
  sectionTitleClass: string;
  /** Optional class applied to experience position titles (e.g. accent color). */
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
 * The pagination heuristics, section ordering, summary, and body rendering
 * are all shared so behavior stays consistent across templates.
 */
export function renderHtmlPages(config: HtmlEngineConfig): ReactNode[][] {
  const {
    data,
    translations,
    bodyTextClass,
    headingTextClass,
    sectionTitleClass,
    experienceTitleColorClass,
    headerElement,
    onJumpToSection,
  } = config;

  const paperSize = data.style?.paperSize || "A4";
  const limit = contentHeightLimitFor(paperSize);

  const pages: ReactNode[][] = [[]];
  let currentHeight = 0;
  let currentPage = 0;

  const addToPage = (element: ReactNode, height: number) => {
    if (currentHeight + height > limit && pages[currentPage].length > 0) {
      currentPage++;
      pages[currentPage] = [];
      currentHeight = 0;
    }
    pages[currentPage].push(element);
    currentHeight += height;
  };

  // Header
  addToPage(headerElement, estimateHeight("header", null));

  // Summary
  if (data.personalInfo.summary) {
    addToPage(
      <HtmlSummary
        summary={data.personalInfo.summary}
        bodyTextClass={bodyTextClass}
        sectionTitleClass={sectionTitleClass}
        translations={translations}
        onJumpToSection={onJumpToSection}
      />,
      estimateHeight("summary", data.personalInfo.summary),
    );
  }

  const renderCtx = {
    translations,
    bodyTextClass,
    headingTextClass,
    sectionTitleClass,
    onJumpToSection,
  };

  const sectionOrder = data.sectionOrder || [
    "experience",
    "education",
    "projects",
    "skills",
    "custom",
  ];

  for (const sectionId of sectionOrder) {
    if (sectionId === "experience" && data.experience.length > 0) {
      const { title, items } = renderExperienceSection(
        data.experience,
        renderCtx,
        { titleColorClass: experienceTitleColorClass },
      );
      addToPage(title, estimateHeight("sectionTitle", null));
      data.experience.forEach((exp, i) => {
        addToPage(items[i], estimateHeight("experienceItem", exp));
      });
    } else if (sectionId === "education" && data.education.length > 0) {
      const { title, items } = renderEducationSection(
        data.education,
        renderCtx,
      );
      addToPage(title, estimateHeight("sectionTitle", null));
      data.education.forEach((edu, i) => {
        addToPage(items[i], estimateHeight("educationItem", edu));
      });
    } else if (sectionId === "skills" && data.skills.length > 0) {
      const { title, items } = renderSkillsSection(data.skills, renderCtx);
      addToPage(title, estimateHeight("sectionTitle", null));
      data.skills.forEach((skill, i) => {
        addToPage(items[i], estimateHeight("skillItem", skill));
      });
    } else if (sectionId === "projects" && data.projects.length > 0) {
      const { title, items } = renderProjectsSection(data.projects, renderCtx);
      addToPage(title, estimateHeight("sectionTitle", null));
      data.projects.forEach((project, i) => {
        addToPage(items[i], estimateHeight("projectItem", project));
      });
    } else if (
      sectionId === "certificates" &&
      data.certificates &&
      data.certificates.length > 0
    ) {
      const { title, items } = renderItemsListSection(
        "certificates",
        data.certificates,
        renderCtx,
      );
      if (title) addToPage(title, estimateHeight("sectionTitle", null));
      data.certificates.forEach((item, i) => {
        addToPage(items[i], estimateHeight("certificatesItem", item));
      });
    } else if (
      sectionId === "awards" &&
      data.awards &&
      data.awards.length > 0
    ) {
      const { title, items } = renderItemsListSection(
        "awards",
        data.awards,
        renderCtx,
      );
      if (title) addToPage(title, estimateHeight("sectionTitle", null));
      data.awards.forEach((item, i) => {
        addToPage(items[i], estimateHeight("awardsItem", item));
      });
    } else if (
      sectionId === "publications" &&
      data.publications &&
      data.publications.length > 0
    ) {
      const { title, items } = renderItemsListSection(
        "publications",
        data.publications,
        renderCtx,
      );
      if (title) addToPage(title, estimateHeight("sectionTitle", null));
      data.publications.forEach((item, i) => {
        addToPage(items[i], estimateHeight("publicationsItem", item));
      });
    } else if (
      sectionId === "custom" &&
      data.customSections &&
      data.customSections.length > 0
    ) {
      const sections = renderCustomSections(data.customSections, renderCtx);
      sections.forEach((section, sIdx) => {
        addToPage(section.title, estimateHeight("sectionTitle", null));
        section.items.forEach((itemEl, iIdx) => {
          const item = data.customSections![sIdx].items[iIdx];
          addToPage(itemEl, estimateHeight("customItem", item));
        });
      });
    }
  }

  return pages;
}
