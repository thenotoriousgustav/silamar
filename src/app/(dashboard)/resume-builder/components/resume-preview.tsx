"use client";

import { PDFPreview } from "./pdf-preview";
import type { ResumeContent } from "@/types/resume";

interface ResumePreviewProps {
  content: ResumeContent;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  return (
    <div className="h-full w-full">
      <PDFPreview content={content} />
    </div>
  );
}
