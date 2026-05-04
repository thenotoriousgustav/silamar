"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeContent } from "@/types/resume";
import { Loader2, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { ResumeTemplate } from "./resume-template";
import { HtmlResume } from "./html-resume";

interface ResumePreviewProps {
  content: ResumeContent;
  onJumpToSection?: (sectionId: string) => void;
}

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export function ResumePreview({
  content,
  onJumpToSection,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT);
  const [isDownloading, setIsDownloading] = useState(false);

  const finalScale = baseScale * zoom;

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
      {/* Inject Resume Fonts */}
      {/* <style
        dangerouslySetInnerHTML={{
          __html: `
        @font-face {
          font-family: 'Calibri';
          src: url('/fonts/calibri.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Georgia';
          src: url('/fonts/georgia.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Times New Roman';
          src: url('/fonts/times.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Helvetica';
          src: url('/fonts/helvetica.ttf') format('truetype');
        }
        
        .font-serif { font-family: 'Times New Roman', serif; }
        .font-sans { font-family: 'Helvetica', sans-serif; }
        .font-calibri { font-family: 'Calibri', sans-serif; }
        .font-georgia { font-family: 'Georgia', serif; }
      `,
        }}
      /> */}

      <div className="flex items-center justify-between px-2">
        <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          Resume Preview (Live)
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
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-muted/30 border-border/50 relative flex-1 overflow-auto border shadow-sm"
      >
        {/* Wrapper that matches the visual scaled size */}
        <div
          className="mx-auto my-10 transition-all duration-300 ease-out"
          style={{
            width: `${A4_WIDTH * finalScale}px`,
            height: `${contentHeight * finalScale}px`,
          }}
        >
          <div
            ref={contentRef}
            className="origin-top-left transition-transform duration-300 ease-out"
            style={{
              width: A4_WIDTH,
              transform: `scale(${finalScale})`,
            }}
          >
            <HtmlResume data={content} onJumpToSection={onJumpToSection} />
          </div>
        </div>
      </div>
    </div>
  );
}
