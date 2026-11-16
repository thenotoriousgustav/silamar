import type { Metadata } from "next";

import { JobFitClient } from "@/features/resume-analysis/components/job-fit/job-fit-client";

export const metadata: Metadata = {
  title: "Analisis Kecocokan Pekerjaan",
  description:
    "Cek seberapa cocok resume kamu dengan pekerjaan tertentu sebelum melamar.",
};

interface PageProps {
  searchParams: Promise<{ resumeId?: string; jobId?: string }>;
}

export default async function JobFitAnalysisPage({ searchParams }: PageProps) {
  const { resumeId, jobId } = await searchParams;

  return <JobFitClient initialResumeId={resumeId} initialJobId={jobId} />;
}
