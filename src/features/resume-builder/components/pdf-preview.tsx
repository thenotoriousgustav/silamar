"use client";

/**
 * PdfPreview — 100% flicker-free PDF preview showing ALL pages.
 *
 * Strategy: TWO PERSISTENT DOCUMENT SLOTS (A/B swap).
 *
 * - Slot A and Slot B each hold their own URL and render ALL pages.
 * - Only one slot is visible at a time (the other is hidden via CSS).
 * - When a new PDF blob is ready, feed it to the HIDDEN slot.
 * - Wait for ALL pages in the hidden slot to fire `onRenderSuccess`.
 * - Only then swap visibility: hidden becomes visible, visible becomes hidden.
 * - Zero flicker — the visible slot never changes its `file` prop while shown.
 *
 * Pages are rendered at `width={A4_W * finalScale}` directly (no CSS transform)
 * so they flow naturally in a flex column and the container height is correct.
 */

import { pdf } from "@react-pdf/renderer";
import {
  Download,
  Loader2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Button } from "@/components/ui/button";
import type { ResumeContent } from "@/types/resume";

import { ResumeTemplate } from "./resume-template";

// ─── pdfjs worker ─────────────────────────────────────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ─── Constants ────────────────────────────────────────────────────────────────
const A4_W = 794;
const DEBOUNCE_MS = 300;

// ─── Types ────────────────────────────────────────────────────────────────────
interface PdfPreviewProps {
  content: ResumeContent;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useDebouncedContent(content: ResumeContent, delay: number) {
  const [debounced, setDebounced] = useState(content);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(content), delay);
    return () => clearTimeout(id);
  }, [content, delay]);
  return debounced;
}

// ─── Slot pages renderer ──────────────────────────────────────────────────────
interface SlotPagesProps {
  url: string;
  numPages: number;
  pageWidth: number;
  isActive: boolean;
  onDocumentLoad: (data: { numPages: number }) => void;
  onPageRenderSuccess?: () => void;
}

function SlotPages({
  url,
  numPages,
  pageWidth,
  isActive,
  onDocumentLoad,
  onPageRenderSuccess,
}: SlotPagesProps) {
  return (
    <Document
      file={url}
      loading={null}
      error={null}
      onLoadSuccess={onDocumentLoad}
    >
      <div className="flex flex-col" style={{ gap: 24 }}>
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i} className="shadow-2xl">
            <Page
              pageNumber={i + 1}
              width={pageWidth}
              renderTextLayer={isActive}
              renderAnnotationLayer={isActive}
              onRenderSuccess={!isActive ? onPageRenderSuccess : undefined}
              loading={null}
              error={null}
            />
          </div>
        ))}
      </div>
    </Document>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PdfPreview({ content }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(A4_W);
  const [zoom, setZoom] = useState(1);
  const pageWidth = Math.min(containerWidth - 40, A4_W) * zoom;

  const debouncedContent = useDebouncedContent(content, DEBOUNCE_MS);

  // ── A/B slot state ────────────────────────────────────────────────────
  const [slotA, setSlotA] = useState<string | null>(null);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slotARef = useRef<string | null>(null);
  const slotBRef = useRef<string | null>(null);

  // numPages for the ACTIVE slot (drives visible rendering)
  const [numPages, setNumPages] = useState<number>(1);
  // numPages for the HIDDEN slot (may differ until swap)
  const [hiddenNumPages, setHiddenNumPages] = useState<number>(1);

  // How many pages in the hidden slot have finished rendering
  const hiddenRenderedRef = useRef(0);
  const hiddenTotalRef = useRef(1);

  // ── Generate PDF blob → feed to hidden slot ───────────────────────────
  useEffect(() => {
    let cancelled = false;
    let generatedUrl: string | null = null;
    let urlUsed = false;

    const generate = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        const blob = await pdf(
          <ResumeTemplate data={debouncedContent} />,
        ).toBlob();
        generatedUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          urlUsed = true;
          hiddenRenderedRef.current = 0;

          if (activeSlot === "A") {
            setSlotB(generatedUrl);
            slotBRef.current = generatedUrl;
          } else {
            setSlotA(generatedUrl);
            slotARef.current = generatedUrl;
          }
        } else {
          URL.revokeObjectURL(generatedUrl);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF generation error:", err);
          setError(
            err instanceof Error ? err.message : "Failed to generate PDF",
          );
          setIsGenerating(false);
        }
      }
    };

    generate();

    return () => {
      cancelled = true;
      if (generatedUrl && !urlUsed) URL.revokeObjectURL(generatedUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  // ── Unmount cleanup ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (slotARef.current) URL.revokeObjectURL(slotARef.current);
      if (slotBRef.current) URL.revokeObjectURL(slotBRef.current);
    };
  }, []);

  // ── Hidden slot: document loaded → know how many pages to wait for ────
  const handleHiddenDocumentLoad = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      hiddenTotalRef.current = n;
      hiddenRenderedRef.current = 0;
      setHiddenNumPages(n);
    },
    [],
  );

  // ── Hidden slot: each page rendered → swap when all done ─────────────
  const handleHiddenPageRender = useCallback(() => {
    hiddenRenderedRef.current += 1;

    if (hiddenRenderedRef.current >= hiddenTotalRef.current) {
      setActiveSlot((current) => {
        const oldSlot = current;
        const newActive = current === "A" ? "B" : "A";

        const oldUrl =
          oldSlot === "A" ? slotARef.current : slotBRef.current;
        if (oldUrl) {
          const u = oldUrl;
          setTimeout(() => URL.revokeObjectURL(u), 1000);
        }

        return newActive;
      });
      // Promote hidden page count to active
      setNumPages(hiddenTotalRef.current);
      setIsGenerating(false);
    }
  }, []);

  // ── Active slot: document loaded (first load only) ────────────────────
  const handleActiveDocumentLoad = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
      // On first load the hidden slot IS the active slot, so also set hidden
      hiddenTotalRef.current = n;
    },
    [],
  );

  // ── Container width observer ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Zoom ──────────────────────────────────────────────────────────────
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  // ── Download ──────────────────────────────────────────────────────────
  const pdfFileName = `${
    content.personalInfo.fullName?.replace(/\s+/g, "_") || "resume"
  }_resume.pdf`;

  const handleDownload = () => {
    const url = activeSlot === "A" ? slotA : slotB;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfFileName;
    a.click();
  };

  const activeUrl = activeSlot === "A" ? slotA : slotB;
  const isFirstLoad = slotA === null && slotB === null;
  const isWaitingForFirst = activeUrl === null && (slotA !== null || slotB !== null);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            PDF Preview (Exact)
          </h2>
          {isGenerating && (
            <Loader2 className="text-muted-foreground h-3.5 w-3.5 animate-spin" />
          )}
          {activeUrl && numPages > 1 && (
            <span className="text-muted-foreground text-[11px]">
              {numPages} pages
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-muted/50 border-border/50 flex items-center rounded-lg border p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <div className="min-w-[45px] text-center text-[11px] font-bold text-slate-500">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
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
              disabled={zoom === 1}
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2"
            onClick={handleDownload}
            disabled={!activeUrl}
          >
            {isFirstLoad || isWaitingForFirst ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span className="text-xs">Download PDF</span>
          </Button>
        </div>
      </div>

      {/* ── Preview area ── */}
      <div
        ref={containerRef}
        className="bg-muted/30 border-border/50 relative flex-1 overflow-auto border shadow-sm"
      >
        {isFirstLoad && !isWaitingForFirst ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Generating preview…
              </p>
            </div>
          </div>
        ) : error && !activeUrl ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 px-5">
            {/*
              Each slot is always mounted (so pdfjs keeps its canvas alive)
              but hidden via display:none when not active.
              display:none is sufficient — pdfjs renders canvases regardless.
              ONE <Document> per URL, no duplicates → no ResponseException (0).
            */}

            {/* ── SLOT A ── */}
            {slotA && (
              <div style={{ display: activeSlot === "A" ? "block" : "none" }}>
                <SlotPages
                  url={slotA}
                  numPages={activeSlot === "A" ? numPages : hiddenNumPages}
                  pageWidth={pageWidth}
                  isActive={activeSlot === "A"}
                  onDocumentLoad={
                    activeSlot === "A"
                      ? handleActiveDocumentLoad
                      : handleHiddenDocumentLoad
                  }
                  onPageRenderSuccess={handleHiddenPageRender}
                />
              </div>
            )}

            {/* ── SLOT B ── */}
            {slotB && (
              <div style={{ display: activeSlot === "B" ? "block" : "none" }}>
                <SlotPages
                  url={slotB}
                  numPages={activeSlot === "B" ? numPages : hiddenNumPages}
                  pageWidth={pageWidth}
                  isActive={activeSlot === "B"}
                  onDocumentLoad={
                    activeSlot === "B"
                      ? handleActiveDocumentLoad
                      : handleHiddenDocumentLoad
                  }
                  onPageRenderSuccess={handleHiddenPageRender}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
