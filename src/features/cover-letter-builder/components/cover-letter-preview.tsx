"use client";

import dynamic from "next/dynamic";

import { ChunkErrorBoundary } from "@/components/shared/chunk-error-boundary";
import { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

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

interface CoverLetterPreviewProps {
  content: Partial<CoverLetterBuilderData>;
}

export function CoverLetterPreview({ content }: CoverLetterPreviewProps) {
  return (
    <div className="h-full w-full">
      <ChunkErrorBoundary>
        <PdfPreview content={content} />
      </ChunkErrorBoundary>
    </div>
  );
}
