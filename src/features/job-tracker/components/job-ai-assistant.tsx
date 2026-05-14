"use client";

import { useMutation } from "@tanstack/react-query";
import {
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileSearch,
  History,
  Lightbulb,
  Loader2,
  MessageSquareQuote,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type JobApplication } from "@/features/job-tracker/types";
import { type CoverLetterResult } from "@/lib/ai/prompts/cover-letter";
import { type ResumeAnalyzeJdResult } from "@/lib/ai/prompts/resume-analyze-jd";
import { cn } from "@/lib/utils";
import { getAnalysisHistory } from "@/features/resume-analysis/actions/get-analysis-history";


interface JobAiAssistantProps {
  job: JobApplication;
  selectedResume?: any;
}

type ViewState = "menu" | "analysis" | "cover-letter";

export function JobAiAssistant({ job, selectedResume }: JobAiAssistantProps) {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("menu");
  const [analysisResult, setAnalysisResult] =
    useState<ResumeAnalyzeJdResult | null>(null);
  const [_coverLetterResult, _setCoverLetterResult] =
    useState<CoverLetterResult | null>(null);
  const [_savedLetterId, _setSavedLetterId] = useState<string | null>(null);

  // Fetch history for the selected resume
  const { data: analysisHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["resume-analysis-history", selectedResume?.id],
    queryFn: async () => {
      if (!selectedResume?.id) return [];
      const res = await getAnalysisHistory(selectedResume.id);
      if (!res.success) return [];
      return res.data;
    },
    enabled: !!selectedResume?.id,
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      if (!selectedResume?.content) {
        throw new Error("Pilih resume terlebih dahulu di tab Detail.");
      }
      if (!job.description || job.description.length < 50) {
        throw new Error("Deskripsi pekerjaan terlalu pendek untuk dianalisa.");
      }

      const res = await fetch("/api/resume/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent:
            typeof selectedResume.content === "string"
              ? selectedResume.content
              : JSON.stringify(selectedResume.content),
          jobDescription: job.description,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal menganalisa resume");
      }

      return res.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.data);
      setView("analysis");
      toast.success("Analisa selesai!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const generateCLMutation = useMutation({
    mutationFn: async () => {
      if (!selectedResume?.content) {
        throw new Error("Pilih resume terlebih dahulu di tab Detail.");
      }

      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent:
            typeof selectedResume.content === "string"
              ? selectedResume.content
              : JSON.stringify(selectedResume.content),
          jobTitle: job.position,
          company: job.company,
          jobDescription: job.description,
          resumeId: selectedResume.id,
          saveLetter: true, // Selalu simpan untuk redirect
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal membuat cover letter");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Cover letter berhasil dibuat!");
      if (data.coverLetterId) {
        router.push(`/cover-letter-builder/${data.coverLetterId}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const _copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Teks disalin ke clipboard!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 60)
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  if (view === "analysis" && analysisResult) {
    return (
      <div className="space-y-6 px-5 py-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 h-8 text-[10px] font-bold tracking-wider uppercase"
          onClick={() => setView("menu")}
        >
          <ChevronLeft className="mr-1 h-3 w-3" /> Kembali ke Menu
        </Button>

        <div className="animate-in fade-in slide-in-from-left-2 space-y-5 duration-300">
          <div className="bg-primary/5 border-primary/10 flex items-center gap-3 border p-4">
            <FileSearch className="text-primary h-5 w-5" />
            <div>
              <h3 className="text-sm font-bold">Hasil Analisa Kecocokan</h3>
              <p className="text-muted-foreground text-[11px]">
                {job.position} @ {job.company}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "space-y-1 border p-6 text-center",
              getScoreColor(analysisResult.matchScore),
            )}
          >
            <div className="text-4xl font-black tracking-tighter">
              {analysisResult.matchScore}%
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase">
              Match Score
            </div>
          </div>

          <div className="bg-background/50 text-muted-foreground border p-3 text-[11px] leading-relaxed italic">
            "{analysisResult.verdict}"
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                <CheckCircle2 className="h-3 w-3 text-green-500" /> Matched
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysisResult.matchedKeywords.map((kw, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="h-4 rounded-none border-green-500/10 bg-green-500/5 px-1.5 py-0 text-[9px] text-green-700"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                <XCircle className="h-3 w-3 text-red-500" /> Missing
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysisResult.missingKeywords.map((kw, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="h-4 rounded-none border-red-500/10 bg-red-500/5 px-1.5 py-0 text-[9px] text-red-700"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
              <Lightbulb className="h-3 w-3 text-yellow-500" /> Rekomendasi
            </h4>
            <ul className="space-y-1.5">
              {analysisResult.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="text-muted-foreground flex items-start gap-2 text-[11px]"
                >
                  <span className="bg-primary mt-1.5 h-1 w-1 shrink-0 rounded-full" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 py-6">
      <div className="bg-primary/5 border-primary/10 flex items-center gap-3 border p-4">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-foreground text-sm font-bold">
            Asisten AI SiLamar
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Membantu persiapan lamaran di{" "}
            <span className="text-foreground font-semibold">{job.company}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Fitur 1: Analisa Kecocokan */}
        <Card className="bg-muted/20 overflow-hidden rounded-none border-dashed">
          <CardHeader className="pb-3">
            <div className="text-primary mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
              <FileSearch className="h-3.5 w-3.5" /> Analisa Kecocokan
            </div>
            <CardTitle className="text-base font-bold">
              Resume vs Deskripsi Kerja
            </CardTitle>
            <CardDescription className="text-xs">
              Lihat seberapa cocok resume kamu dengan kriteria perusahaan ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              className="w-full text-xs font-bold"
              variant="outline"
              onClick={() => {
                if (analysisResult) {
                  setView("analysis");
                } else if (selectedResume?.id) {
                  router.push(
                    `/resume-analyze?resumeId=${selectedResume.id}&jobId=${job.id}`,
                  );
                } else {
                  toast.error("Pilih resume terlebih dahulu di tab Detail.");
                }
              }}
              disabled={analyzeMutation.isPending}
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Menganalisa...
                </>
              ) : analysisHistory.length > 0 ? (
                "Lihat Analisa"
              ) : (
                "Mulai Analisis"
              )}
            </Button>

            {analysisHistory.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                  <History className="h-3 w-3" /> Riwayat Analisa
                </div>
                <div className="space-y-1.5">
                  {analysisHistory.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border border-border/50 bg-background/50 p-2 text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "flex h-5 w-8 items-center justify-center font-bold text-white",
                          item.overallScore >= 80 ? "bg-emerald-500" : item.overallScore >= 60 ? "bg-amber-500" : "bg-red-500"
                        )}>
                          {item.overallScore}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold">Skor Analisa</span>
                          <span className="text-[9px] text-muted-foreground">
                            {format(new Date(item.createdAt), "d MMM yyyy HH:mm", { locale: idLocale })}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[9px] font-bold"
                        onClick={() => router.push(`/resume-analyze?resumeId=${selectedResume.id}&jobId=${job.id}`)}
                      >
                        Detail
                      </Button>
                    </div>
                  ))}
                  {analysisHistory.length > 3 && (
                    <p className="text-center text-[9px] text-muted-foreground">
                      +{analysisHistory.length - 3} riwayat lainnya
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fitur 2: Cover Letter */}
        <Card className="bg-muted/20 overflow-hidden rounded-none border-dashed">
          <CardHeader className="pb-3">
            <div className="text-primary mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
              <MessageSquareQuote className="h-3.5 w-3.5" /> Surat Lamaran
            </div>
            <CardTitle className="text-base font-bold">
              Generate Cover Letter
            </CardTitle>
            <CardDescription className="text-xs">
              Buat surat lamaran personal untuk posisi {job.position}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              className="w-full text-xs font-bold"
              variant="outline"
              onClick={() => generateCLMutation.mutate()}
              disabled={generateCLMutation.isPending}
            >
              {generateCLMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Sedang Dibuat...
                </>
              ) : (
                "Buat Cover Letter"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Fitur 3: Interview (Coming Soon UI) */}
        <Card className="bg-muted/20 rounded-none border-dashed">
          <CardHeader className="pb-3">
            <div className="text-primary mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
              <BrainCircuit className="h-3.5 w-3.5" /> Persiapan Interview
            </div>
            <CardTitle className="text-base font-bold">
              Prediksi Pertanyaan
            </CardTitle>
            <CardDescription className="text-xs">
              Dapatkan daftar pertanyaan interview berdasarkan profil
              perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              className="w-full text-xs font-bold"
              variant="outline"
              disabled
            >
              Segera Hadir
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
