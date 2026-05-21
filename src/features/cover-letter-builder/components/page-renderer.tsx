"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { A4Page } from "./a4-page";
import {
  type Block,
  CONTENT_WIDTH,
  distributeBlocksToPages,
  type PageBlocks,
} from "./pagination-engine";

interface PageRendererProps {
  blocks: Block[];
  containerClass?: string;
}

/**
 * PageRenderer — the orchestrator.
 *
 * Flow:
 *  1. Render all blocks into a hidden off-screen measurer div.
 *  2. After layout, read each block's offsetHeight via refs.
 *  3. Run distributeBlocksToPages() with measured heights.
 *  4. Render the resulting pages as A4Page components.
 *
 * Anti-flicker: pages are only shown after measurement is complete.
 * The measurer is always off-screen and invisible.
 */
export function PageRenderer({ blocks, containerClass }: PageRendererProps) {
  const measurerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [pages, setPages] = useState<PageBlocks[]>([]);
  const [measured, setMeasured] = useState(false);

  // Stable block ids for dependency tracking
  const blockKey = useMemo(
    () => blocks.map((b) => b.id + b.html).join("|"),
    [blocks],
  );

  useEffect(() => {
    // Wait for measurer to be in DOM
    if (!measurerRef.current) return;

    // Use rAF to ensure browser has laid out the measurer
    const raf = requestAnimationFrame(() => {
      const measured = blocks.map((block) => {
        const el = blockRefs.current.get(block.id);
        const height = el ? el.offsetHeight : 20;
        return { ...block, measuredHeight: height };
      });

      const distributed = distributeBlocksToPages(measured);
      setPages(distributed);
      setMeasured(true);
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockKey]);

  return (
    <div
      className={cn("flex flex-col items-center gap-10 pb-10", containerClass)}
    >
      {/* ── Hidden measurer ── */}
      <div
        ref={measurerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: -9999,
          width: CONTENT_WIDTH,
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
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        ))}
      </div>

      {/* ── Rendered pages ── */}
      {measured && pages.length > 0 ? (
        pages.map((page, pageIdx) => (
          <A4Page key={pageIdx}>
            {page.blocks.map((block) => (
              <div
                key={block.id}
                style={{ marginBottom: block.marginBottom ?? 0 }}
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            ))}
          </A4Page>
        ))
      ) : (
        // Show a single empty page while measuring
        <A4Page>
          <div />
        </A4Page>
      )}
    </div>
  );
}
