/**
 * Block-based pagination engine for cover letter preview.
 *
 * Approach:
 *  1. Each piece of content is a "Block" with an id and a render function.
 *  2. Heights are measured via a hidden DOM container (actual browser layout).
 *  3. Blocks are distributed into pages based on measured heights.
 *  4. No heuristics — pagination is always accurate.
 */

export const PAGE_WIDTH = 794;   // A4 at 96 DPI
export const PAGE_HEIGHT = 1123; // A4 at 96 DPI
export const PAGE_PADDING_X = 50;
export const PAGE_PADDING_Y = 50;
export const CONTENT_WIDTH = PAGE_WIDTH - PAGE_PADDING_X * 2;   // 694px
export const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING_Y * 2; // 1023px

export interface Block {
  id: string;
  /** HTML string to render inside the measurer. */
  html: string;
  /** Extra bottom margin after this block (in px). */
  marginBottom?: number;
}

export interface PageBlocks {
  blocks: Block[];
}

/**
 * Measures the rendered height of an HTML string inside a hidden container
 * with the same width as the page content area.
 */
export function measureBlockHeight(
  html: string,
  containerClass: string = "",
): number {
  const el = document.createElement("div");
  el.style.visibility = "hidden";
  el.style.position = "absolute";
  el.style.top = "-9999px";
  el.style.left = "-9999px";
  el.style.width = `${CONTENT_WIDTH}px`;
  el.style.pointerEvents = "none";
  if (containerClass) el.className = containerClass;
  el.innerHTML = html;
  document.body.appendChild(el);
  const height = el.offsetHeight;
  document.body.removeChild(el);
  return height;
}

/**
 * Distributes blocks into pages. Each page accumulates blocks until the
 * next block would overflow CONTENT_HEIGHT, then a new page starts.
 *
 * @param blocks  Array of blocks with pre-measured heights.
 * @returns       Array of pages, each containing an array of blocks.
 */
export function distributeBlocksToPages(
  blocks: Array<Block & { measuredHeight: number }>,
): PageBlocks[] {
  const pages: PageBlocks[] = [{ blocks: [] }];
  let currentHeight = 0;
  let currentPage = 0;

  for (const block of blocks) {
    const blockHeight = block.measuredHeight + (block.marginBottom ?? 0);

    if (
      currentHeight + blockHeight > CONTENT_HEIGHT &&
      pages[currentPage].blocks.length > 0
    ) {
      // Start a new page
      currentPage++;
      pages[currentPage] = { blocks: [] };
      currentHeight = 0;
    }

    pages[currentPage].blocks.push(block);
    currentHeight += blockHeight;
  }

  return pages;
}
