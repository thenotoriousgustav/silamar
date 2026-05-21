import type { ReactNode } from "react";

import type { ResumePaperSize } from "@/types/resume";

import { PAGE_DIMENSIONS_PT, PAGE_PADDING_PT } from "./constants";

/**
 * A single renderable unit a template feeds to the pagination engine.
 *
 * Templates emit a flat array of these in document order. The engine
 * measures each block's actual rendered height with the DOM, then
 * distributes them into pages — so pagination is pixel-accurate and
 * always matches what would happen if the content were rendered in a
 * react-pdf <Page>.
 */
export interface ResumeBlock {
  /** Stable id used both for React keys and ref tracking during measurement. */
  id: string;
  /** The rendered React node. */
  node: ReactNode;
  /**
   * If true, the engine will not break a page between this block and the
   * next one — used for section titles so they never end up alone at the
   * bottom of a page.
   */
  keepWithNext?: boolean;
}

/**
 * Returns the content-area dimensions (in pt-equivalent CSS pixels) for
 * a given paper size. The HTML preview's content layer is rendered at
 * these dimensions and then visually scaled up by `PT_TO_PX` to display.
 */
export function pageContentDimensions(paperSize: ResumePaperSize) {
  const page = PAGE_DIMENSIONS_PT[paperSize];
  return {
    width: page.width - PAGE_PADDING_PT * 2,
    height: page.height - PAGE_PADDING_PT * 2,
  };
}

/**
 * Distributes pre-measured blocks into pages.
 *
 * Rules:
 *  - A block whose addition would exceed `contentHeight` starts a new
 *    page (unless the current page is empty, in which case it stays).
 *  - If a block has `keepWithNext`, it is grouped with subsequent blocks
 *    until a block without `keepWithNext` is reached. The whole group
 *    breaks together — never split.
 */
export function distributeBlocks(
  blocks: Array<ResumeBlock & { measuredHeight: number }>,
  contentHeight: number,
): ResumeBlock[][] {
  const pages: ResumeBlock[][] = [[]];
  let currentHeight = 0;
  let currentPage = 0;

  const breakPage = () => {
    currentPage++;
    pages[currentPage] = [];
    currentHeight = 0;
  };

  // Group consecutive `keepWithNext` blocks with the following block.
  let i = 0;
  while (i < blocks.length) {
    const group: Array<ResumeBlock & { measuredHeight: number }> = [];
    while (i < blocks.length) {
      group.push(blocks[i]);
      if (!blocks[i].keepWithNext) {
        i++;
        break;
      }
      i++;
    }

    const groupHeight = group.reduce((sum, b) => sum + b.measuredHeight, 0);

    if (
      currentHeight + groupHeight > contentHeight &&
      pages[currentPage].length > 0
    ) {
      breakPage();
    }

    for (const block of group) {
      pages[currentPage].push(block);
      currentHeight += block.measuredHeight;
    }
  }

  return pages;
}
