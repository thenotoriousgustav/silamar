"use client";

/**
 * PdfPreview — 100% flicker-free PDF preview.
 *
 * Strategy: TWO PERSISTENT DOCUMENT SLOTS (A/B swap).
 *
 * The reason react-pdf flickers: when you change the `file` prop on a
 * <Document>, it unmounts the old pages and renders blank canvases while
 * the new PDF loads. No amount of off-screen pre-rendering avoids this
 * because the visible Document still receives the new URL.
 *
 * Solution: maintain TWO <Document> components permanently mounted.
 * - Slot A and Slot B each hold their own URL.
 * - Only one slot is visible at a time (the other is hidden via CSS).
 * - When a new PDF blob is ready, feed it to the HIDDEN slot.
 * - Wait for `onRenderSuccess` on the hidden slot's <Page>.
 * - Only then swap visibility: hidden becomes visible, visible becomes hidden.
 * - The previously-visible slot keeps its old canvas intact until it receives
 *   the next update — no blank frame ever appears.
 *
 * Memory: old blob URLs are revoked 1s after the swap (gives any in-flight
 * renders time to finish). On unmount, both are revoked via refs.
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
const A4_H = 1123;
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

// ─── Component ────────────────────────────────────────────────────────────────
export function PdfPreview({ content }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const finalScale = scale * zoom;

  const debouncedContent = useDebouncedContent(content, DEBOUNCE_MS);

  // ── A/B slot state ────────────────────────────────────────────────────
  // Each slot holds a URL. `activeSlot` indicates which is currently visible.
  const [slotA, setSlotA] = useState<string | null>(null);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for unmount cleanup
  const slotARef = useRef<string | null>(null);
  const slotBRef = useRef<string | null>(null);

  // Page state
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Track which slot is pending (the hidden one receiving the new URL)
  const pendingSlot = activeSlot === "A" ? "B" : "A";

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
          // Feed to the HIDDEN slot (the one that's not active)
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
      if (generatedUrl && !urlUsed) {
        URL.revokeObjectURL(generatedUrl);
      }
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

  // ── Hidden slot render success → swap visibility ──────────────────────
  const handleHiddenRenderSuccess = useCallback(() => {
    // The hidden slot's page is fully painted. Swap visibility.
    setActiveSlot((current) => {
      const oldSlot = current;
      const newActive = current === "A" ? "B" : "A";

      // Revoke the old slot's URL after a delay (it's now hidden but
      // we give it time for any in-flight operations).
      const oldUrl = oldSlot === "A" ? slotARef.current : slotBRef.current;
      if (oldUrl) {
        const urlToRevoke = oldUrl;
        setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
      }

      return newActive;
    });
    setIsGenerating(false);
  }, []);

  const handleDocumentLoadSuccess = useCallback(
    ({ numPages: n }: { numPages: number }) => {
      setNumPages(n);
      setCurrentPage((prev) => Math.min(prev, n));
    },
    [],
  );

  // ── Auto-scale ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width - 40;
      setScale(Math.min(w / A4_W, 1));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Zoom ──────────────────────────────────────────────────────────────
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  // ── Page navigation ───────────────────────────────────────────────────
  const handlePreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, numPages));

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
  const hiddenUrl = activeSlot === "A" ? slotB : slotA;
  const isFirstLoad = activeUrl === null && hiddenUrl === null;
  const isWaitingForFirst = activeUrl === null && hiddenUrl !== null;

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
              {Math.round(finalScale * 100)}%
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
          <div className="flex flex-col items-center py-10">
            <div
              className="relative"
              style={{
                width: A4_W * finalScale,
                height: A4_H * finalScale,
              }}
            >
              {/* ── SLOT A ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  visibility: activeSlot === "A" && slotA ? "visible" : "hidden",
                  zIndex: activeSlot === "A" ? 2 : 1,
                }}
              >
                {slotA && (
                  <div
                    className="origin-top-left shadow-2xl"
                    style={{
                      transform: `scale(${finalScale})`,
                      transformOrigin: "top left",
                      width: A4_W,
                      height: A4_H,
                    }}
                  >
                    <Document
                      file={slotA}
                      loading={null}
                      error={null}
                      onLoadSuccess={
                        activeSlot === "A" ? handleDocumentLoadSuccess : undefined
                      }
                    >
                      <Page
                        pageNumber={currentPage}
                        width={A4_W}
                        renderTextLayer={activeSlot === "A"}
                        renderAnnotationLayer={activeSlot === "A"}
                        onRenderSuccess={
                          activeSlot !== "A" ? handleHiddenRenderSuccess : undefined
                        }
                        loading={null}
                        error={null}
                      />
                    </Document>
                  </div>
                )}
              </div>

              {/* ── SLOT B ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  visibility: activeSlot === "B" && slotB ? "visible" : "hidden",
                  zIndex: activeSlot === "B" ? 2 : 1,
                }}
              >
                {slotB && (
                  <div
                    className="origin-top-left shadow-2xl"
                    style={{
                      transform: `scale(${finalScale})`,
                      transformOrigin: "top left",
                      width: A4_W,
                      height: A4_H,
                    }}
                  >
                    <Document
                      file={slotB}
                      loading={null}
                      error={null}
                      onLoadSuccess={
                        activeSlot === "B" ? handleDocumentLoadSuccess : undefined
                      }
                    >
                      <Page
                        pageNumber={currentPage}
                        width={A4_W}
                        renderTextLayer={activeSlot === "B"}
                        renderAnnotationLayer={activeSlot === "B"}
                        onRenderSuccess={
                          activeSlot !== "B" ? handleHiddenRenderSuccess : undefined
                        }
                        loading={null}
                        error={null}
                      />
                    </Document>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Page navigation ── */}
      {activeUrl && numPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          <span className="text-muted-foreground min-w-[80px] text-center text-xs font-medium">
            Page {currentPage} / {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
