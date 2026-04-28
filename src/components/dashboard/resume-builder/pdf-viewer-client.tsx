"use client";

import { useState, useEffect, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ResumeContent } from "@/types/resume";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ResumeTemplate } from "./resume-template";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const A4_ASPECT_RATIO = 1.414;

interface PDFViewerClientProps {
  data: ResumeContent;
  zoom: number;
  viewMode: "single" | "all";
  currentPage: number;
  onLoad: (numPages: number) => void;
  onError: (error: string | null) => void;
  onRenderSuccess: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function PDFViewerClient({
  data,
  zoom,
  viewMode,
  currentPage,
  onLoad,
  onError,
  onRenderSuccess,
}: PDFViewerClientProps) {
  const [debouncedData] = useDebounce(data, 300);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previousPdfUrl, setPreviousPdfUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [numPages, setNumPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const pdfUrlRef = useRef<string | null>(null);
  const previousPdfUrlRef = useRef<string | null>(null);

  // Resize Observer for responsive width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(Math.max(width - 40, 400));
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
      if (previousPdfUrlRef.current)
        URL.revokeObjectURL(previousPdfUrlRef.current);
    };
  }, []);

  // Generate PDF blob URL
  useEffect(() => {
    let cancelled = false;
    let generatedUrl: string | null = null;
    let urlSetToState = false;

    const generatePdf = async () => {
      setIsRendering(true);
      setError(null);
      onError(null);

      try {
        const blob = await pdf(
          <ResumeTemplate data={debouncedData} />,
        ).toBlob();
        const objectUrl = URL.createObjectURL(blob);
        generatedUrl = objectUrl;

        if (!cancelled) {
          urlSetToState = true;
          setPdfUrl(() => {
            pdfUrlRef.current = objectUrl;
            return objectUrl;
          });
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("PDF generation error:", err);
          const msg =
            err instanceof Error ? err.message : "Failed to generate PDF";
          setError(msg);
          onError(msg);
          setIsRendering(false);
        }
      }
    };

    generatePdf();

    return () => {
      cancelled = true;
      // Only revoke if URL was created but never set to state
      if (generatedUrl && !urlSetToState) {
        URL.revokeObjectURL(generatedUrl);
      }
    };
  }, [debouncedData, onError]);

  const handleRenderSuccess = () => {
    // Atomic swap as per the Dual-Document pattern
    setPreviousPdfUrl((prev) => {
      if (prev && prev !== pdfUrl) {
        // Revoke after a delay to allow for transition
        setTimeout(() => URL.revokeObjectURL(prev), 500);
      }
      previousPdfUrlRef.current = pdfUrl;
      return pdfUrl;
    });

    setIsRendering(false);
    onRenderSuccess();
  };

  const handleDocumentLoadSuccess = ({
    numPages: count,
  }: {
    numPages: number;
  }) => {
    setNumPages(count);
    onLoad(count);
  };

  const handleDocumentLoadError = (err: Error) => {
    console.error("Document load error:", err);
    const msg = "Failed to load PDF document";
    setError(msg);
    onError(msg);
    setIsRendering(false);
  };

  const isFirstRender = !previousPdfUrl;
  const shouldShowPrevious =
    !isFirstRender && isRendering && previousPdfUrl !== pdfUrl;
  const shouldShowInitialPaper = isFirstRender && isRendering;

  return (
    <div
      ref={containerRef}
      className="bg-muted/30 relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* Initial Loading Skeleton (Paper Shape) */}
      {shouldShowInitialPaper && (
        <div className="absolute inset-0 z-1000 flex items-center justify-center p-5">
          <div
            className="bg-white shadow-2xl transition-all duration-500"
            style={{
              width: containerWidth * zoom,
              aspectRatio: "1 / 1.414",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
              <p className="text-xs text-slate-300">Rendering PDF...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-background absolute inset-0 z-1000 flex flex-col items-center justify-center gap-3 p-5">
          <p className="text-destructive text-center text-sm">{error}</p>
        </div>
      )}

      {!error && (
        <div className="custom-scrollbar relative flex w-full flex-1 overflow-auto p-5">
          <div
            className={cn(
              "relative m-auto flex flex-col gap-8",
              viewMode === "single"
                ? "items-center justify-center"
                : "items-center",
            )}
            style={{ width: containerWidth * zoom }}
          >
            {/* Stable White Paper Layer */}
            <div
              className="bg-white shadow-2xl transition-all duration-300"
              style={{
                width: containerWidth * zoom,
                minHeight: containerWidth * zoom * A4_ASPECT_RATIO,
              }}
            >
              <div className="relative h-full w-full">
                {/* Previous PDF (Faded Transition) */}
                {viewMode === "single" &&
                  shouldShowPrevious &&
                  previousPdfUrl && (
                    <div className="absolute inset-0 z-0 opacity-50 transition-opacity duration-200">
                      <Document
                        file={previousPdfUrl}
                        loading={null}
                        error={null}
                      >
                        <Page
                          pageNumber={currentPage}
                          width={containerWidth * zoom}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                  )}

                {/* New PDF (Visible when ready or as primary layer) */}
                <div
                  className={cn(
                    "relative z-10 transition-opacity duration-300",
                    shouldShowPrevious ? "opacity-0" : "opacity-100",
                  )}
                >
                  {pdfUrl && (
                    <Document
                      file={pdfUrl}
                      loading={null}
                      error={null}
                      onLoadSuccess={handleDocumentLoadSuccess}
                      onLoadError={handleDocumentLoadError}
                    >
                      {viewMode === "single" ? (
                        <Page
                          pageNumber={currentPage}
                          width={containerWidth * zoom}
                          onRenderSuccess={handleRenderSuccess}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                      ) : (
                        <div className="bg-muted/20 flex flex-col gap-8">
                          {Array.from(new Array(numPages), (el, index) => (
                            <div
                              key={`page_${index + 1}`}
                              className="bg-white shadow-2xl last:mb-0"
                            >
                              <Page
                                pageNumber={index + 1}
                                width={containerWidth * zoom}
                                onRenderSuccess={
                                  index === 0 ? handleRenderSuccess : undefined
                                }
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </Document>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
