"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { ResumePaperSize } from "@/types/resume";

import {
  PAGE_DIMENSIONS,
  PAGE_DIMENSIONS_PT,
  PAGE_PADDING_PT,
  PT_TO_PX,
} from "./constants";
import {
  distributeBlocks,
  type ResumeBlock,
} from "./pagination";

interface HtmlPageWrapperProps {
  /** Flat list of blocks emitted by the template, in document order. */
  blocks: ResumeBlock[];
  /** Tailwind classes applied to every page (font-family lives here). */
  containerClass?: string;
  /** Paper size — drives page geometry. Defaults to A4. */
  paperSize?: ResumePaperSize;
  /**
   * Per-template padding override in PDF points. Falls back to the default
   * (50pt all sides) when omitted. Use this when the PDF template uses
   * non-default padding (e.g. Harvard/Oxford use 50 horizontal, 45 vertical)
   * — keeping the preview's content area in sync is what makes pagination
   * pixel-accurate.
   */
  padding?: {
    horizontal?: number;
    vertical?: number;
  };
}

/**
 * HtmlPageWrapper — measures blocks against a hidden off-screen container
 * sized exactly like the PDF content area (in PDF points, treated as CSS
 * pixels), distributes them into pages, then renders each page as an
 * A4-sized white sheet with the content layer visually scaled up by
 * `PT_TO_PX` (≈4/3) to fill the sheet.
 *
 * Why this matches react-pdf output:
 *   - The content layer is laid out at PDF-point dimensions, so text reflow
 *     happens in exactly the same coordinate space as @react-pdf/renderer.
 *   - We measure real DOM heights instead of estimating, so pagination is
 *     pixel-accurate.
 *   - The visual scale-to-A4-pixels happens via CSS transform — content is
 *     never reflowed by the browser at preview time.
 */
export function HtmlPageWrapper({
  blocks,
  containerClass,
  paperSize = "A4",
  padding,
}: HtmlPageWrapperProps) {
  const measurerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [measured, setMeasured] = useState(false);

  const visualPage = PAGE_DIMENSIONS[paperSize];
  const paddingX = padding?.horizontal ?? PAGE_PADDING_PT;
  const paddingY = padding?.vertical ?? PAGE_PADDING_PT;
  const pagePt = PAGE_DIMENSIONS_PT[paperSize];
  const contentArea = useMemo(
    () => ({
      width: pagePt.width - paddingX * 2,
      height: pagePt.height - paddingY * 2,
    }),
    [pagePt.width, pagePt.height, paddingX, paddingY],
  );

  // Heights map keyed by block id. Maintained by the measurer effect and
  // re-read on every render so `pages` always references the latest React
  // nodes from the current `blocks` prop.
  const heightsRef = useRef<Map<string, number>>(new Map());
  // A monotonically-increasing counter that bumps whenever heights change.
  // Used as a render-trigger so distribution re-runs after measurement.
  const [measureToken, setMeasureToken] = useState(0);

  // Re-distribute on every render using whatever heights we have. New
  // blocks default to a small placeholder height until measurement
  // completes, which is harmless because the measurer effect will
  // immediately re-trigger with the real height.
  const pages = useMemo(() => {
    const measuredBlocks = blocks.map((block) => ({
      ...block,
      measuredHeight: heightsRef.current.get(block.id) ?? 20,
    }));
    return distributeBlocks(measuredBlocks, contentArea.height);
    // measureToken is the explicit "heights changed" signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, contentArea.height, measureToken]);

  // Renderable pages — empty placeholder while we measure to avoid a
  // flash of overflowing content on first paint.
  const renderedPages: ResumeBlock[][] = measured ? pages : [[]];

  useEffect(() => {
    const measurer = measurerRef.current;
    if (!measurer) return;

    let raf: number | null = null;
    const remeasure = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let changed = false;
        for (const [id, el] of blockRefs.current) {
          const next = el.offsetHeight;
          if (heightsRef.current.get(id) !== next) {
            heightsRef.current.set(id, next);
            changed = true;
          }
        }
        // Drop stale entries for blocks that no longer exist.
        for (const id of heightsRef.current.keys()) {
          if (!blockRefs.current.has(id)) {
            heightsRef.current.delete(id);
            changed = true;
          }
        }
        if (changed) setMeasureToken((t) => t + 1);
        if (!measured) setMeasured(true);
      });
    };

    remeasure();
    const observer = new ResizeObserver(remeasure);
    observer.observe(measurer);

    return () => {
      observer.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
    // `measured` is intentionally excluded — we only need the initial flip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0 pb-10",
        containerClass,
      )}
    >
      {/* ── Hidden measurer ──────────────────────────────────────────── */}
      <div
        ref={measurerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: -9999,
          width: contentArea.width,
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            ref={(el) => {
              if (el) blockRefs.current.set(block.id, el);
              else blockRefs.current.delete(block.id);
            }}
          >
            {block.node}
          </div>
        ))}
      </div>

      {/* ── Rendered pages ───────────────────────────────────────────── */}
      {renderedPages.map((pageBlocks, pageIdx) => (
        <div key={pageIdx} className="flex flex-col items-center">
          {pageIdx > 0 && (
            <div className="text-muted-foreground my-4 flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase">
              <div className="bg-border h-px w-12" />
              <span>Page {pageIdx + 1}</span>
              <div className="bg-border h-px w-12" />
            </div>
          )}

          <div
            className={cn(
              "relative shrink-0 overflow-hidden bg-white shadow-2xl transition-shadow",
              "hover:shadow-primary/5",
              !measured && "opacity-90",
            )}
            style={{
              width: visualPage.width,
              height: visualPage.height,
            }}
          >
            {/*
              Content layer — laid out at PDF-point dimensions (in CSS
              pixels), then scaled up visually so the page reads at A4
              size. This is the trick that keeps text reflow identical
              between preview and PDF.
            */}
            <div
              className="origin-top-left"
              style={{
                width: pagePt.width,
                height: pagePt.height,
                paddingTop: paddingY,
                paddingBottom: paddingY,
                paddingLeft: paddingX,
                paddingRight: paddingX,
                transform: `scale(${PT_TO_PX})`,
              }}
            >
              {pageBlocks.map((block) => (
                <div key={block.id}>{block.node}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
