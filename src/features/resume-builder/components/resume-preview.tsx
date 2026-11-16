"use client";

import dynamic from "next/dynamic";

import { ChunkErrorBoundary } from "@/components/shared/chunk-error-boundary";
import type { ResumeContent } from "@/types/resume";

const PdfPreview = dynamic(
  () => import("./pdf-preview").then((m) => ({ default: m.PdfPreview })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="bg-muted h-[600px] w-[420px] animate-pulse rounded-lg" />
      </div>
    ),
  },
);

interface ResumePreviewProps {
  content: ResumeContent;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  return (
    <div className="h-full w-full">
      <ChunkErrorBoundary>
        <PdfPreview content={content} />
      </ChunkErrorBoundary>
    </div>
  );
}
