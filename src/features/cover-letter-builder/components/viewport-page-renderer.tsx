"use client";

import { memo, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;
export const PAGE_PADDING_X = 50;
export const PAGE_PADDING_Y = 50;
export const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING_Y * 2; // 1023px

interface ViewportPageRendererProps {
  children: ReactNode;
}

/**
 * CSS Viewport-based pagination for cover letter preview.
 *
 * How it works:
 *  1. Render all content once in a hidden off-screen container to measure
 *     the total height.
 *  2. Calculate page count: Math.ceil(totalHeight / CONTENT_HEIGHT).
 *  3. Each "page" is a fixed-height div (overflow: hidden) that shows a
 *     clipped window into the content via translateY offset.
 *
 * Benefits over block-based approach:
 *  - No flicker — pages render immediately from the same content tree.
 *  - No block splitting logic — content is one React tree.
 *  - Re-renders are cheap — only ResizeObserver on one container.
 *  - ~50 lines vs ~200 lines of pagination logic.
 *
 * Trade-off: paragraphs can be clipped mid-line at page boundaries
 * (same limitation as all CSS-based approaches).
 */
export const ViewportPageRenderer = memo(function ViewportPageRenderer({
  children,
}: ViewportPageRendererProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const totalHeight = entry.contentRect.height;
      setPageCount(Math.max(1, Math.ceil(totalHeight / CONTENT_HEIGHT)));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center gap-10 pb-10">
      {/* ── Visible pages ── */}
      {Array.from({ length: pageCount }, (_, pageIndex) => (
        <div
          key={pageIndex}
          className="relative shrink-0 bg-white shadow-2xl"
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            overflow: "hidden",
          }}
        >
          {/* Content window — shifted up by pageIndex * CONTENT_HEIGHT */}
          <div
            style={{
              position: "absolute",
              top: PAGE_PADDING_Y - pageIndex * CONTENT_HEIGHT,
              left: PAGE_PADDING_X,
              right: PAGE_PADDING_X,
            }}
          >
            {children}
          </div>
        </div>
      ))}

      {/* ── Hidden measurer — renders content at full width to get real height ── */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: -9999,
          width: PAGE_WIDTH - PAGE_PADDING_X * 2,
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {children}
      </div>
    </div>
  );
});
