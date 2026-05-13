"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FileSearch,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getUserResumesAction } from "@/features/job-tracker/actions";
import type { ResumeContent } from "@/types/resume";

import type { ComprehensiveAnalysisDTO } from "../types/resume-analyzer-dto";

import { AnalyzerActionItems } from "./analyzer-action-items";
import { AnalyzerATSCompatibility } from "./analyzer-ats-compatibility";
import { AnalyzerContentQuality } from "./analyzer-content-quality";
import { AnalyzerKeywordAnalysis } from "./analyzer-keyword-analysis";
import { AnalyzerOverallScore } from "./analyzer-overall-score";
import { AnalyzerRedFlags } from "./analyzer-red-flags";
import { AnalyzerSectionScores } from "./analyzer-section-scores";
import { AnalyzerStrengths } from "./analyzer-strengths";
import { HighlightedResumePreview } from "./highlighted-resume-preview";

interface ResumeAnalyzerClientProps {
  resumeId: string;
  jobId?: string;
}

export function ResumeAnalyzerClient({
  resumeId,
  jobId,
}: ResumeAnalyzerClientProps) {
  const [result, setResult] = useState<ComprehensiveAnalysisDTO | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Fetch resume data
  const { data: userResumes = [] } = useQuery({
    queryKey: ["user-resumes"],
    queryFn: () => getUserResumesAction(),
  });

  const selectedResume = userResumes.find((r: any) => r.id === resumeId);

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/resume/analyze-comprehensive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menganalisis resume");
      return json.data as ComprehensiveAnalysisDTO;
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Analisis mendalam selesai! 🎉");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Terjadi kesalahan. Coba lagi.");
    },
  });

  const backUrl = jobId ? `/job-tracker` : `/documents/resumes`;

  // Landing state — prompt user to start analysis
  if (!result && !analyzeMutation.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-12">
        <div className="flex items-center gap-3">
          <Link href={backUrl}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="border-border space-y-6 border p-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center">
              <FileSearch className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Analisis Resume Mendalam</h1>
              <p className="text-muted-foreground text-sm">
                Dapatkan analisis komprehensif resume kamu dengan AI
              </p>
            </div>
          </div>

          {selectedResume ? (
            <div className="bg-muted/30 border-border/50 flex items-center gap-3 border p-4">
              <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {selectedResume.title}
                </p>
                {selectedResume.atsScore && (
                  <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
                    Skor ATS saat ini: {selectedResume.atsScore}%
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="border-border/50 flex items-center justify-center border border-dashed p-8 text-center">
              <p className="text-muted-foreground text-sm">
                Memuat data resume...
              </p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase">
              Yang akan dianalisis:
            </h3>
            <ul className="text-muted-foreground space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1.5 w-1.5 shrink-0" />
                Skor keseluruhan dan grade resume
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1.5 w-1.5 shrink-0" />
                Kompatibilitas ATS (Applicant Tracking System)
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1.5 w-1.5 shrink-0" />
                Skor per section dan feedback detail
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1.5 w-1.5 shrink-0" />
                Kualitas konten, action verbs, dan penulisan
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1.5 w-1.5 shrink-0" />
                Analisis keyword dan red flags
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1.5 w-1.5 shrink-0" />
                Action items prioritas dan estimasi waktu
              </li>
            </ul>
          </div>

          <Button
            onClick={() => analyzeMutation.mutate()}
            className="h-12 w-full text-sm font-bold"
            disabled={!selectedResume}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Mulai Analisis Mendalam (1 Kredit)
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (analyzeMutation.isPending) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="bg-primary/10 flex h-20 w-20 items-center justify-center">
              <Loader2 className="text-primary h-10 w-10 animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">AI sedang menganalisis resume...</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Proses ini memerlukan waktu 15-30 detik
            </p>
          </div>
          <div className="bg-muted h-1.5 w-64 overflow-hidden">
            <div className="bg-primary h-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  // Results view — split panel
  if (!result) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-border flex shrink-0 items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href={backUrl}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Job Tracker
            </Button>
          </Link>
          <div className="bg-border h-5 w-px" />
          <h1 className="text-sm font-bold">Analisis Resume Mendalam</h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ${
              result.overallScore.total >= 80
                ? "bg-emerald-500/10 text-emerald-600"
                : result.overallScore.total >= 60
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-red-500/10 text-red-600"
            }`}
          >
            Skor: {result.overallScore.total}/100 ({result.overallScore.grade})
          </div>
        </div>
      </div>

      {/* Split Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Analysis Results */}
        <div className="custom-scrollbar w-1/2 overflow-y-auto border-r p-6">
          <div className="mx-auto max-w-xl space-y-6">
            <AnalyzerOverallScore data={result.overallScore} />
            <AnalyzerATSCompatibility data={result.atsCompatibility} />
            <AnalyzerSectionScores data={result.sectionScores} />
            <AnalyzerContentQuality data={result.contentQuality} />
            <AnalyzerKeywordAnalysis data={result.keywordAnalysis} />
            <AnalyzerRedFlags
              data={result.redFlags}
              onHighlight={setActiveHighlight}
            />
            <AnalyzerStrengths data={result.strengths} />
            <AnalyzerActionItems data={result.actionItems} />

            {/* Competitive Insight */}
            <div className="border-border space-y-3 border p-5">
              <h3 className="text-xs font-bold tracking-wider uppercase">
                📊 Competitive Insight
              </h3>
              <p className="text-sm">
                Resume kamu lebih baik dari{" "}
                <span className="text-primary font-bold">
                  {result.competitiveInsight.percentile}%
                </span>{" "}
                resume yang pernah dianalisis.
              </p>
              {result.competitiveInsight.topMissingElements.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1.5 text-[10px] font-bold tracking-wider uppercase">
                    Elemen yang belum ada:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.competitiveInsight.topMissingElements.map(
                      (el, i) => (
                        <span
                          key={i}
                          className="bg-muted text-muted-foreground px-2 py-0.5 text-[11px] font-medium"
                        >
                          {el}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel — Resume Preview with Highlights */}
        <div className="w-1/2 overflow-hidden">
          {selectedResume?.content ? (
            <HighlightedResumePreview
              content={selectedResume.content as ResumeContent}
              highlights={result.highlights}
              activeHighlight={activeHighlight}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Memuat preview resume...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
