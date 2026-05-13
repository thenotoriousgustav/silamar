import type { Metadata } from "next";

import { ResumeAnalyzerClient } from "@/features/resume-analysis/components/resume-analyzer-client";

export const metadata: Metadata = {
  title: "Analisis Resume Mendalam",
  description:
    "Analisis resume mendalam dengan AI — skor ATS, red flags, keyword, dan saran perbaikan",
};

export default async function ResumeAnalyzePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const resumeId = searchParams.resumeId as string | undefined;
  const jobId = searchParams.jobId as string | undefined;

  if (!resumeId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Resume tidak ditemukan</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Silakan pilih resume dari Job Tracker untuk mulai analisis.
          </p>
        </div>
      </div>
    );
  }

  return <ResumeAnalyzerClient resumeId={resumeId} jobId={jobId} />;
}
