import type { ReactNode } from "react";

import type { ResumePaperSize } from "@/types/resume";

import { PAGE_DIMENSIONS, PAGE_PADDING } from "./constants";

/**
 * Heuristic height estimator (in CSS pixels) used to decide when to break to
 * a new page in the HTML preview. Numbers are calibrated against the actual
 * rendered output at the default font size (11px) and density.
 *
 * The estimates are intentionally conservative — under-estimating slightly
 * is preferable to over-estimating because over-estimation causes premature
 * page breaks that leave large empty gaps at the bottom of pages.
 */
export function estimateHeight(
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any,
): number {
  switch (type) {
    case "header":
      // Name + title + 1-2 contact rows ≈ ~80–100px
      return 100;
    case "summary": {
      // ~17px per ~80 chars + section title (~25) + small margin
      const len = content?.length ?? 0;
      return 35 + Math.ceil(len / 80) * 17;
    }
    case "sectionTitle":
      // h2 + bottom border + small margin
      return 28;
    case "experienceItem": {
      // 2 header rows (~17px each) + bullets (~16px each) + item gap
      const bullets = countBullets(content?.description);
      return 38 + bullets * 16 + 8;
    }
    case "educationItem": {
      const bullets = countBullets(content?.description);
      return 36 + bullets * 16 + 6;
    }
    case "skillItem":
      // Single inline line
      return 18;
    case "projectItem": {
      const bullets = countBullets(content?.description);
      const linkLine = content?.link ? 12 : 0;
      return 22 + linkLine + bullets * 16 + 6;
    }
    case "customItem":
    case "certificatesItem":
    case "awardsItem":
    case "publicationsItem": {
      const bullets = countBullets(content?.description);
      const subtitleLine = content?.subtitle ? 16 : 0;
      const linkLine = content?.link ? 12 : 0;
      return 22 + subtitleLine + linkLine + bullets * 16 + 6;
    }
    default:
      return 16;
  }
}

/** Counts list items in either Lexical-HTML output or DescriptionItem[]. */
function countBullets(description: unknown): number {
  if (!description) return 0;
  if (typeof description === "string") {
    return (description.match(/<li/g) || []).length;
  }
  if (Array.isArray(description)) return description.length;
  return 0;
}

/**
 * Returns the content-area height (page height minus padding) for a given
 * paper size. Used by the paginator to decide when to overflow to a new page.
 */
export function contentHeightLimitFor(paperSize: ResumePaperSize): number {
  return PAGE_DIMENSIONS[paperSize].height - PAGE_PADDING;
}

/**
 * Builds an `addToPage` accumulator. The accumulator pushes elements onto
 * the current page until adding the next element would overflow the height
 * limit, at which point it starts a new page.
 *
 * Two commit modes are exposed:
 *  - `addToPage(node, height)` — single element, may break before this
 *    element if it doesn't fit.
 *  - `addAtomic([{ node, height }, ...])` — group of elements that must
 *    stay together. If the group doesn't fit on the current page, the
 *    paginator breaks before the *whole group* (not in the middle), so a
 *    section title never ends up orphaned at the bottom of a page.
 *
 * Usage:
 *   const { pages, addToPage, addAtomic } = createPaginator(paperSize);
 *   addToPage(<Header/>, estimateHeight("header", null));
 *   addAtomic([{ node: title, height: 45 }, { node: firstItem, height: 80 }]);
 *   ...
 *   return pages;
 */
export function createPaginator(paperSize: ResumePaperSize) {
  const limit = contentHeightLimitFor(paperSize);
  const pages: ReactNode[][] = [[]];
  let currentHeight = 0;
  let currentPage = 0;

  const breakPage = () => {
    currentPage++;
    pages[currentPage] = [];
    currentHeight = 0;
  };

  const addToPage = (element: ReactNode, height: number) => {
    if (currentHeight + height > limit && pages[currentPage].length > 0) {
      breakPage();
    }
    pages[currentPage].push(element);
    currentHeight += height;
  };

  const addAtomic = (group: Array<{ node: ReactNode; height: number }>) => {
    if (group.length === 0) return;
    const totalHeight = group.reduce((sum, g) => sum + g.height, 0);
    // If the whole group can't fit on the current page, start fresh — but
    // only if the current page has content (avoid creating an empty first
    // page when the very first group is large).
    if (
      currentHeight + totalHeight > limit &&
      pages[currentPage].length > 0
    ) {
      breakPage();
    }
    for (const { node, height } of group) {
      pages[currentPage].push(node);
      currentHeight += height;
    }
  };

  return { pages, addToPage, addAtomic };
}
