"use client";

import {
  Braces,
  Check,
  Copy,
  Eye,
  FileText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ResumeContent } from "@/types/resume";

import { HtmlResume, PAGE_DIMENSIONS } from "./html-resume";
import { PdfPreview } from "./pdf-preview";

interface ResumePreviewProps {
  content: ResumeContent;
  onJumpToSection?: (sectionId: string) => void;
}

/** Three view modes available in the preview panel. */
type ViewMode = "visual" | "pdf" | "json";

export function ResumePreview({
  content,
  onJumpToSection,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const paperSize = content.style?.paperSize || "A4";
  const pageWidth: number = PAGE_DIMENSIONS[paperSize].width;
  const pageHeight: number = PAGE_DIMENSIONS[paperSize].height;
  const [contentHeight, setContentHeight] = useState<number>(pageHeight);
  const [mode, setMode] = useState<ViewMode>("visual");
  const [copied, setCopied] = useState(false);

  const finalScale = baseScale * zoom;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scale based on container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width - 40;
      setBaseScale(Math.min(availableWidth / pageWidth, 1));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [pageWidth]);

  // Track content height for the HTML preview scroll area
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentHeight(entry.contentRect.height);
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-2">
        {/* Title */}
        <h2 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
          {mode === "json" ? (
            <Braces className="h-4 w-4" />
          ) : mode === "pdf" ? (
            <FileText className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {mode === "json"
            ? "Resume Data (JSON)"
            : mode === "pdf"
              ? "PDF Preview (Exact)"
              : "Resume Preview (Live)"}
        </h2>

        <div className="flex items-center gap-4">
          {/* Mode switcher */}
          <div className="bg-muted/50 border-border/50 flex items-center rounded-lg border p-1">
            <Button
              variant={mode === "visual" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-[10px] font-bold uppercase"
              onClick={() => setMode("visual")}
              title="HTML preview — click sections to jump to editor"
            >
              Visual
            </Button>
            <Button
              variant={mode === "pdf" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-[10px] font-bold uppercase"
              onClick={() => setMode("pdf")}
              title="Pixel-perfect PDF preview — identical to downloaded file"
            >
              PDF
            </Button>
            <Button
              variant={mode === "json" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-[10px] font-bold uppercase"
              onClick={() => setMode("json")}
            >
              JSON
            </Button>
          </div>

          {/* Mode-specific actions */}
          {mode === "json" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJson}
              className="h-8 gap-2"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-xs">Copy JSON</span>
            </Button>
          )}

          {mode === "visual" && (
            <div className="bg-muted/50 border-border/50 flex items-center rounded-lg border p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <span className="text-xs">−</span>
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
                <span className="text-xs">+</span>
              </Button>
              <div className="bg-border/50 mx-1 h-4 w-[1px]" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleResetZoom}
                title="Reset Zoom"
              >
                <span className="text-[9px] font-bold">1:1</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      {mode === "pdf" ? (
        /*
          PDF mode — PdfPreview manages its own container and toolbar
          (zoom + download). Rendered outside the shared containerRef so
          it can fill the remaining height independently.
        */
        <div className="flex-1 overflow-hidden">
          <PdfPreview content={content} />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="bg-muted/30 border-border/50 relative flex-1 overflow-auto border shadow-sm"
        >
          {mode === "json" ? (
            /* ── JSON view ── */
            <div className="flex h-full w-full flex-col p-6">
              <div className="relative h-full w-full overflow-hidden rounded-none border border-slate-800 bg-slate-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                    <span className="ml-2 text-[10px] font-medium tracking-tight text-slate-400">
                      resume_data.json
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {JSON.stringify(content).length} bytes
                  </span>
                </div>
                <div className="custom-scrollbar h-[calc(100%-40px)] overflow-auto p-6 font-mono text-xs leading-relaxed text-slate-300">
                  <pre className="break-all whitespace-pre-wrap">
                    {JSON.stringify(content, null, 2)}
                  </pre>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />
              </div>
            </div>
          ) : (
            /* ── Visual (HTML) view ── */
            <div
              className="mx-auto my-10 transition-all duration-300 ease-out"
              style={{
                width: `${pageWidth * finalScale}px`,
                height: `${contentHeight * finalScale}px`,
              }}
            >
              <div
                ref={contentRef}
                className="origin-top-left transition-transform duration-300 ease-out"
                style={{
                  width: pageWidth,
                  transform: `scale(${finalScale})`,
                }}
              >
                <HtmlResume
                  data={content}
                  onJumpToSection={onJumpToSection}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
