import type { Metadata } from "next";

import { ResumeAnalysisClient } from "@/features/resume-analysis";

export const metadata: Metadata = {
  title: "Analisis Resume",
  description: "Analisis resume kamu dengan AI untuk meningkatkan skor ATS",
};

export default function ResumeAnalysisPage() {
  return <ResumeAnalysisClient />;
}
