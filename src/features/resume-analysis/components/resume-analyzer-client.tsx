"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  Clock,
  Eye,
  FileSearch,
  History,
  Loader2,
  Monitor,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useHeaderDispatch } from "@/components/providers/header-provider";
import { SplitViewLayout } from "@/components/shared/split-view-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserResumesAction } from "@/features/job-tracker/actions";
import { getAnalysisHistory } from "@/features/resume-analysis/actions/get-analysis-history";
import type { ResumeContent } from "@/types/resume";

import type { ComprehensiveAnalysisDTO } from "@/features/resume-analysis/types/resume-analyzer-dto";

import { ActionItems } from "@/features/resume-analysis/components/action-items";
import { ATSCompatibility } from "@/features/resume-analysis/components/ats-compatibility";
import { ContentQuality } from "@/features/resume-analysis/components/content-quality";
import { KeywordAnalysis } from "@/features/resume-analysis/components/keyword-analysis";
import { OverallScore } from "@/features/resume-analysis/components/overall-score";
import { RedFlags } from "@/features/resume-analysis/components/red-flags";
import { SectionScores } from "@/features/resume-analysis/components/section-scores";
import { Strengths } from "@/features/resume-analysis/components/strengths";
import { HighlightedResumePreview } from "@/features/resume-analysis/components/highlighted-resume-preview";

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
  const [hasInitializedResult, setHasInitializedResult] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "form" | "preview">(
    "split",
  );
  const queryClient = useQueryClient();
  const { setTitle, setActions } = useHeaderDispatch();

  // Fetch resume data
  const { data: userResumes = [] } = useQuery({
    queryKey: ["user-resumes"],
    queryFn: () => getUserResumesAction(),
  });

  const selectedResume = userResumes.find((r: any) => r.id === resumeId);

  // Fetch analysis history
  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["analysis-history", resumeId],
    queryFn: async () => {
      const res = await getAnalysisHistory(resumeId);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!resumeId,
  });

  // Automatically show the latest analysis result if available (only on initial load)
  useEffect(() => {
    if (!hasInitializedResult && !isLoadingHistory) {
      if (history && history.length > 0) {
        setResult(history[0].result);
      }
      setHasInitializedResult(true);
    }
  }, [history, isLoadingHistory, hasInitializedResult]);

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
      queryClient.invalidateQueries({
        queryKey: ["analysis-history", resumeId],
      });
      toast.success("Analisis mendalam selesai! 🎉");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Terjadi kesalahan. Coba lagi.");
    },
  });

  const backUrl = jobId ? `/job-tracker` : `/documents/resumes`;

  // Inject header content when result is available, clear on unmount
  useEffect(() => {
    if (!result) {
      setTitle("");
      setActions(null);
      return;
    }

    setTitle(
      <div className="flex items-center gap-3">
        <Link href={backUrl}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Job Tracker
          </Button>
        </Link>
      </div>,
    );

    setActions(
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Toggles (Desktop) */}
        <div className="hidden lg:block">
          <Tabs
            value={viewMode}
            onValueChange={(v) =>
              setViewMode(v as "split" | "form" | "preview")
            }
            className="w-fit"
          >
            <TabsList className="bg-muted border-border h-9">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                <Monitor className="mr-1.5 h-3.5 w-3.5" />
                Analisis
              </TabsTrigger>
              <TabsTrigger
                value="split"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                Split
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* View Toggles (Mobile) */}
        <div className="lg:hidden">
          <Tabs
            value={viewMode === "split" ? "form" : viewMode}
            onValueChange={(v) =>
              setViewMode(v as "split" | "form" | "preview")
            }
            className="w-fit"
          >
            <TabsList className="bg-muted border-border h-9">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                Analisis
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="bg-border h-5 w-px" />

        {history && history.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 px-3">
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Riwayat</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-[10px] font-bold tracking-wider uppercase">
                Pilih Hasil Analisis
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="custom-scrollbar max-h-60 overflow-y-auto">
                {history.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setResult(item.result)}
                    className="flex flex-col items-start gap-0.5 py-2"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-xs font-bold">
                        Skor: {item.overallScore}
                      </span>
                      <span className="text-muted-foreground text-[9px]">
                        {format(new Date(item.createdAt), "d MMM yyyy", {
                          locale: idLocale,
                        })}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-[9px]">
                      <Clock className="h-2.5 w-2.5" />
                      {format(new Date(item.createdAt), "HH:mm", {
                        locale: idLocale,
                      })}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="default"
          size="sm"
          className="h-8 gap-2 px-3 text-xs font-bold"
          onClick={() => setResult(null)}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Analisis Baru</span>
        </Button>

        <div className="bg-border h-5 w-px" />
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
      </div>,
    );

    return () => {
      setTitle("");
      setActions(null);
    };
  }, [result, history, backUrl, viewMode, setTitle, setActions]);

  // Loading history state
  if (isLoadingHistory && !hasInitializedResult) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

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
            <p className="text-sm font-bold">
              AI sedang menganalisis resume...
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Proses ini memerlukan waktu 15-30 detik
            </p>
          </div>
          <div className="bg-muted h-1.5 w-64 overflow-hidden">
            <div
              className="bg-primary h-full animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Results view — split panel
  if (!result) return null;

  const analysisPanel = (
    <div className="custom-scrollbar h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-xl space-y-6">
        <OverallScore data={result.overallScore} />
        <ATSCompatibility data={result.atsCompatibility} />
        <SectionScores data={result.sectionScores} />
        <ContentQuality data={result.contentQuality} />
        <KeywordAnalysis data={result.keywordAnalysis} />
        <RedFlags data={result.redFlags} onHighlight={setActiveHighlight} />
        <Strengths data={result.strengths} />
        <ActionItems data={result.actionItems} />

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
                {result.competitiveInsight.topMissingElements.map((el, i) => (
                  <span
                    key={i}
                    className="bg-muted text-muted-foreground px-2 py-0.5 text-[11px] font-medium"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const previewPanel = selectedResume?.content ? (
    <HighlightedResumePreview
      content={selectedResume.content as ResumeContent}
      highlights={result.highlights}
      activeHighlight={activeHighlight}
    />
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground text-sm">Memuat preview resume...</p>
    </div>
  );

  return (
    <SplitViewLayout
      viewMode={viewMode}
      formPanel={analysisPanel}
      previewPanel={previewPanel}
    />
  );
}
