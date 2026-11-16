"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ResumeContent } from "@/types/resume";

import { ResumeTextView } from "@/features/resume-builder/components/resume-text-view";

import type { HighlightAnnotation } from "../types/resume-analyzer-dto";

interface HighlightedResumePreviewProps {
  content: ResumeContent;
  highlights: HighlightAnnotation[];
  activeHighlight?: string | null;
}

const HIGHLIGHT_COLORS: Record<HighlightAnnotation["type"], string> = {
  red_flag: "rgba(239, 68, 68, 0.25)",
  weak_verb: "rgba(245, 158, 11, 0.25)",
  typo: "rgba(234, 179, 8, 0.3)",
  keyword_found: "rgba(16, 185, 129, 0.2)",
  overused: "rgba(245, 158, 11, 0.2)",
};

const HIGHLIGHT_BORDER: Record<HighlightAnnotation["type"], string> = {
  red_flag: "2px solid rgba(239, 68, 68, 0.6)",
  weak_verb: "2px solid rgba(245, 158, 11, 0.5)",
  typo: "2px dashed rgba(234, 179, 8, 0.6)",
  keyword_found: "2px solid rgba(16, 185, 129, 0.4)",
  overused: "2px dashed rgba(245, 158, 11, 0.5)",
};

export function HighlightedResumePreview({
  content,
  highlights,
  activeHighlight,
}: HighlightedResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [contentHeight, setContentHeight] = useState(1122); // A4 height default
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    type: HighlightAnnotation["type"];
  } | null>(null);

  const A4_WIDTH = 794;
  const finalScale = baseScale * zoom;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  // Auto-scale based on container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const availableWidth = containerWidth - 40;
      setBaseScale(Math.min(availableWidth / A4_WIDTH, 1));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Track content height to adjust scrollable area
  useEffect(() => {
    if (!resumeRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentHeight(entry.contentRect.height);
    });
    observer.observe(resumeRef.current);
    return () => observer.disconnect();
  }, []);

  // Apply highlights to the rendered resume HTML
  const applyHighlights = useCallback(() => {
    if (!resumeRef.current || highlights.length === 0) return;

    // Remove previous highlights
    resumeRef.current.querySelectorAll("[data-highlight]").forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        parent.normalize();
      }
    });

    // Walk text nodes and apply highlights
    const walker = document.createTreeWalker(
      resumeRef.current,
      NodeFilter.SHOW_TEXT,
      null,
    );

    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (node.textContent && node.textContent.trim().length > 0) {
        textNodes.push(node);
      }
    }

    for (const highlight of highlights) {
      const searchText = highlight.text.trim();
      if (!searchText || searchText.length < 2) continue;

      for (const textNode of textNodes) {
        const content = textNode.textContent || "";
        const index = content.toLowerCase().indexOf(searchText.toLowerCase());

        if (index === -1) continue;

        // Split the text node and wrap the match
        const before = content.substring(0, index);
        const match = content.substring(index, index + searchText.length);
        const after = content.substring(index + searchText.length);

        const mark = document.createElement("mark");
        mark.setAttribute("data-highlight", highlight.type);
        mark.setAttribute("data-tooltip", highlight.tooltip);
        mark.style.backgroundColor = HIGHLIGHT_COLORS[highlight.type];
        mark.style.borderBottom = HIGHLIGHT_BORDER[highlight.type];
        mark.style.padding = "1px 2px";
        mark.style.cursor = "pointer";
        mark.style.transition = "all 0.2s ease";
        mark.textContent = match;

        // Tooltip handlers
        mark.addEventListener("mouseenter", (e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            setTooltip({
              text: highlight.tooltip,
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top - 8,
              type: highlight.type,
            });
          }
          (e.target as HTMLElement).style.backgroundColor =
            highlight.type === "red_flag"
              ? "rgba(239, 68, 68, 0.4)"
              : highlight.type === "keyword_found"
                ? "rgba(16, 185, 129, 0.35)"
                : "rgba(245, 158, 11, 0.4)";
        });

        mark.addEventListener("mouseleave", (e) => {
          setTooltip(null);
          (e.target as HTMLElement).style.backgroundColor =
            HIGHLIGHT_COLORS[highlight.type];
        });

        const parent = textNode.parentNode;
        if (parent) {
          const fragment = document.createDocumentFragment();
          if (before) fragment.appendChild(document.createTextNode(before));
          fragment.appendChild(mark);
          if (after) fragment.appendChild(document.createTextNode(after));
          parent.replaceChild(fragment, textNode);
        }

        break; // Only highlight first occurrence per highlight
      }
    }
  }, [highlights]);

  // Apply highlights after render
  useEffect(() => {
    const timer = setTimeout(applyHighlights, 500);
    return () => clearTimeout(timer);
  }, [applyHighlights, content]);

  // Scroll to active highlight
  useEffect(() => {
    if (!activeHighlight || !resumeRef.current) return;
    const marks = resumeRef.current.querySelectorAll("[data-highlight]");
    for (const mark of marks) {
      if (
        mark.textContent?.toLowerCase().includes(activeHighlight.toLowerCase())
      ) {
        mark.scrollIntoView({ behavior: "smooth", block: "center" });
        // Flash animation
        const el = mark as HTMLElement;
        el.style.transition = "all 0.3s ease";
        el.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.5)";
        setTimeout(() => {
          el.style.boxShadow = "none";
        }, 2000);
        break;
      }
    }
  }, [activeHighlight]);

  // Highlight legend
  const legendItems = [
    { type: "red_flag" as const, label: "Red Flag", color: "bg-red-500/30" },
    {
      type: "weak_verb" as const,
      label: "Kata Lemah",
      color: "bg-amber-500/30",
    },
    { type: "typo" as const, label: "Typo", color: "bg-yellow-500/30" },
    {
      type: "keyword_found" as const,
      label: "Keyword",
      color: "bg-emerald-500/30",
    },
    {
      type: "overused" as const,
      label: "Berlebihan",
      color: "bg-amber-400/30",
    },
  ];

  return (
    <div ref={containerRef} className="relative flex h-full flex-col">
      {/* Toolbar: Legend + Zoom Controls */}
      <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2">
        {/* Legend */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-muted-foreground shrink-0 text-[10px] font-bold tracking-wider uppercase">
            Highlight:
          </span>
          {legendItems.map((item) => (
            <div key={item.type} className="flex shrink-0 items-center gap-1">
              <span className={`h-3 w-3 ${item.color}`} />
              <span className="text-muted-foreground text-[9px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="bg-muted/50 border-border/50 flex shrink-0 items-center rounded-lg border p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <div className="min-w-[45px] text-center text-[11px] font-bold text-slate-500">
            {Math.round(finalScale * 100)}%
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <div className="bg-border/50 mx-1 h-4 w-[1px]" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="custom-scrollbar bg-muted/30 border-border/50 relative flex-1 overflow-auto border shadow-sm">
        <div
          className="mx-auto my-10 transition-all duration-300 ease-out"
          style={{
            width: `${A4_WIDTH * finalScale}px`,
            height: `${contentHeight * finalScale}px`,
          }}
        >
          <div
            ref={resumeRef}
            className="origin-top-left transition-transform duration-300 ease-out"
            style={{
              width: A4_WIDTH,
              transform: `scale(${finalScale})`,
            }}
          >
            <ResumeTextView data={content} />
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 max-w-xs -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div
            className={`rounded-none px-3 py-2 text-[10px] font-medium shadow-lg ${
              tooltip.type === "red_flag"
                ? "border-red-500/30 bg-red-950 text-red-200"
                : tooltip.type === "keyword_found"
                  ? "border-emerald-500/30 bg-emerald-950 text-emerald-200"
                  : "border-amber-500/30 bg-amber-950 text-amber-200"
            } border`}
          >
            {tooltip.text}
          </div>
        </div>
      )}
    </div>
  );
}
