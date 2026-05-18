import type { ReactNode } from "react";

export function createPaginator(paperSize: string = "A4") {
  const PAGE_HEIGHT = 1123;
  const PAGE_PADDING = 100; // 50px top + 50px bottom
  const limit = PAGE_HEIGHT - PAGE_PADDING;

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

  return { pages, addToPage };
}
