"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer";
import {
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LayoutGrid,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonGroup } from "@/components/ui/button-group";
import { ResumeTemplate } from "./resume-template";
import type { ResumeContent } from "@/types/resume";

// Dynamically import PDFViewer with SSR disabled
const PDFViewerClient = dynamic(
  () => import("./pdf-viewer-client").then((mod) => mod.PDFViewerClient),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted/30 flex h-full w-full items-center justify-center p-8">
        <div
          className="bg-white shadow-2xl transition-all duration-500"
          style={{
            width: "min(100%, 600px)",
            aspectRatio: "1 / 1.414",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
            <p className="text-xs font-medium text-slate-300">
              Initializing PDF Engine...
            </p>
          </div>
        </div>
      </div>
    ),
  },
);

interface PDFPreviewProps {
  content: ResumeContent;
  title?: string;
  showDownload?: boolean;
  height?: string;
}

export function PDFPreview({
  content,
  title = "Resume Preview",
  showDownload = true,
  height = "100%",
}: PDFPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const onZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const onZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const onResetZoom = () => setZoom(0.75);

  const onPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const onNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, numPages));

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await pdf(<ResumeTemplate data={content} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${content.personalInfo.fullName?.replace(/\s+/g, "_") || "resume"}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <ButtonGroup>
            <Button
              onClick={() =>
                setViewMode(viewMode === "single" ? "all" : "single")
              }
              title={
                viewMode === "single" ? "Show All Pages" : "Show Single Page"
              }
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              {viewMode === "single" ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button
              onClick={onZoomOut}
              disabled={zoom <= 0.5}
              title="Zoom Out"
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <div className="bg-background flex h-8 min-w-15 items-center justify-center border-y px-3 text-xs font-medium">
              {Math.round(zoom * 100)}%
            </div>

            <Button
              onClick={onZoomIn}
              disabled={zoom >= 3}
              title="Zoom In"
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              onClick={onResetZoom}
              disabled={zoom === 0.75}
              title="Reset Zoom"
              variant="outline"
              size="icon"
              className="ml-1 h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </ButtonGroup>

          {showDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-8 gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="text-xs">Download PDF</span>
            </Button>
          )}
        </div>
      </div>
      <Card className="border-border/50 flex-1 overflow-hidden p-0 shadow-sm">
        <CardContent className="p-0" style={{ height }}>
          <PDFViewerClient
            data={content}
            zoom={zoom}
            viewMode={viewMode}
            currentPage={currentPage}
            onLoad={setNumPages}
            onError={setError}
            onRenderSuccess={() => {}}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onResetZoom={onResetZoom}
          />
        </CardContent>
      </Card>
      {!error && numPages > 1 && viewMode === "single" && (
        <div className="bg-background flex h-16 w-full shrink-0 items-center justify-end gap-3 border-t px-5">
          <ButtonGroup>
            <Button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="h-8"
            >
              ← Prev
            </Button>

            <div className="bg-background flex h-8 items-center justify-center border-y px-3 text-xs font-medium">
              {currentPage} / {numPages}
            </div>

            <Button
              onClick={onNextPage}
              disabled={currentPage >= numPages}
              variant="outline"
              size="sm"
              className="h-8"
            >
              Next →
            </Button>
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}
