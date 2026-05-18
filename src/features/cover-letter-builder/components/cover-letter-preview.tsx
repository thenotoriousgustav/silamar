"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

import { CoverLetterTemplate } from "./cover-letter-template";
import { HtmlCoverLetter } from "./html-cover-letter";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface CoverLetterPreviewProps {
  content: Partial<CoverLetterBuilderData>;
}

export function CoverLetterPreview({ content }: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [contentHeight, setContentHeight] = useState<number>(A4_HEIGHT);

  const finalScale = baseScale * zoom;

  const pdfFileName = `${content.fullName?.replace(/\s+/g, "_") || "surat"}_lamaran.pdf`;

  // Auto-scale based on container width — mirrors resume-preview behavior
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

  // Track actual rendered content height (may span multiple A4 pages)
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContentHeight(entry.contentRect.height);
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          Cover Letter Preview (Live)
        </h2>

        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="bg-muted/50 border-border/50 flex items-center rounded-lg border p-1">
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

          <PDFDownloadLink
            document={<CoverLetterTemplate data={content} />}
            fileName={pdfFileName}
            className="inline-flex h-8 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            {({ loading }) =>
              loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-xs">Download PDF</span>
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>

      {/* ── Scrollable preview area ── */}
      <div
        ref={containerRef}
        className="bg-muted/30 border-border/50 relative flex-1 overflow-auto border shadow-sm"
      >
        {/*
          Outer div: sized to the scaled dimensions so the scrollable area
          knows exactly how much space the content takes — same pattern as
          resume-preview.tsx.
        */}
        <div
          className="mx-auto my-10 transition-all duration-300 ease-out"
          style={{
            width: `${A4_WIDTH * finalScale}px`,
            height: `${contentHeight * finalScale}px`,
          }}
        >
          {/*
            Inner div: always A4_WIDTH wide, scaled via transform.
            origin-top-left ensures scaling anchors to the top-left corner
            of the outer wrapper, which is already centered by mx-auto.
          */}
          <div
            ref={contentRef}
            className="origin-top-left transition-transform duration-300 ease-out"
            style={{
              width: A4_WIDTH,
              transform: `scale(${finalScale})`,
            }}
          >
            <HtmlCoverLetter data={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
