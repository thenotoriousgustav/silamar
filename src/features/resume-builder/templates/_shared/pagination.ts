import type { ReactNode } from "react";

import type { ResumePaperSize } from "@/types/resume";

import { PAGE_DIMENSIONS, PAGE_PADDING } from "./constants";

/**
 * Heuristic height estimator (in CSS pixels) used to decide when to break to
 * a new page in the HTML preview. Numbers are tuned by eye, not measured —
 * the actual layout still relies on browser flow inside each page wrapper.
 */
export function estimateHeight(
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any,
): number {
  switch (type) {
    case "header":
      return 160;
    case "summary":
      return 40 + ((content?.length ?? 0) / 80) * 15;
    case "sectionTitle":
      return 45;
    case "experienceItem": {
      const isHtml = typeof content?.description === "string";
      const itemCount = isHtml
        ? (content.description.match(/<li/g) || []).length || 3
        : Array.isArray(content?.description)
          ? content.description.length
          : 0;
      return 60 + itemCount * 18;
    }
    case "educationItem":
      return 55;
    case "skillItem":
      return 25;
    case "projectItem": {
      const projectItemCount =
        typeof content?.description === "string"
          ? (content.description.match(/<li/g) || []).length || 2
          : content?.description?.length || 0;
      return 70 + (projectItemCount ? 40 : 0);
    }
    case "customItem":
    case "certificatesItem":
    case "awardsItem":
    case "publicationsItem": {
      const desc = content?.description ?? "";
      const cnt =
        typeof desc === "string"
          ? (desc.match(/<li/g) || []).length || 2
          : Array.isArray(desc)
            ? desc.length
            : 0;
      return 60 + (cnt ? 30 : 0);
    }
    default:
      return 20;
  }
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
 * Usage:
 *   const { pages, addToPage } = createPaginator(paperSize);
 *   addToPage(<Header/>, estimateHeight("header", null));
 *   ...
 *   return pages;
 */
export function createPaginator(paperSize: ResumePaperSize) {
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

  return { pages, addToPage };
}
