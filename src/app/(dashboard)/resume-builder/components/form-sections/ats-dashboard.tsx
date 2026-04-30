"use client";

import { useState } from "react";
import { 
  Zap, 
  ChevronRight, 
  BarChart3, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculateCompleteness,
  getCompletenessFeedback,
} from "@/lib/resume/completeness";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ResumeContent } from "@/types/resume";

interface ATSDashboardProps {
  content: ResumeContent;
  atsResult: any;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  setAtsResult: (result: any) => void;
}

export function ATSDashboard({
  content,
  atsResult,
  isAnalyzing,
  onRunAnalysis,
  setAtsResult,
}: ATSDashboardProps) {
  const [isCompletenessOpen, setIsCompletenessOpen] = useState(false);
  const completeness = calculateCompleteness(content);
  const score = completeness.score;
  const feedback = getCompletenessFeedback(score);

  return (
    <>
      {/* Completeness Dashboard */}
      <Dialog open={isCompletenessOpen} onOpenChange={setIsCompletenessOpen}>
        <div className="shrink-0" onClick={() => setIsCompletenessOpen(true)}>
          <Card className="group border-primary/20 bg-card hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-none border shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
            <div className="bg-primary/5 absolute top-2 right-2 flex items-center gap-1 rounded-none px-2 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-primary text-[9px] font-bold uppercase">
                Lihat Detail
              </span>
              <ChevronRight className="text-primary h-2.5 w-2.5" />
            </div>

            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-none border transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">
                      Kesiapan Resume
                    </h3>
                    <p
                      className={cn(
                        "text-[10px] font-medium tracking-wider uppercase",
                        feedback.color,
                      )}
                    >
                      {feedback.message}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-foreground text-2xl font-black">
                    {score}%
                  </span>
                </div>
              </div>

              <div className="bg-primary/10 border-primary/5 h-2.5 w-full overflow-hidden rounded-none border">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-out",
                    feedback.bg,
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunAnalysis();
                  }}
                  disabled={isAnalyzing}
                  className="hover:bg-primary/5 border-border bg-background h-8 gap-1.5 rounded-none text-[10px] font-bold transition-all"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <BarChart3 className="text-brand-500 h-3 w-3" />
                  )}
                  {isAnalyzing
                    ? "Menganalisis..."
                    : "Analisis Skor ATS"}
                </Button>
                <div className="border-border bg-background flex items-center gap-1.5 rounded-none border px-2.5 py-1 text-[10px] font-medium shadow-sm">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  ATS Format Validated
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogContent className="overflow-hidden rounded-none border-none p-0 shadow-2xl sm:max-w-2xl">
          <div className="from-primary/10 via-background to-background bg-linear-to-br p-8">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-14 w-14 items-center justify-center rounded-none shadow-lg">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-foreground text-2xl font-black tracking-tight italic">
                    RESUME READINESS
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 flex h-1.5 w-24 overflow-hidden rounded-none">
                      <div
                        className={cn("h-full", feedback.bg)}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                      {score}% COMPLETED
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-black tracking-tighter uppercase italic",
                    feedback.color,
                  )}
                >
                  {feedback.message}
                </p>
                <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                  Current Status
                </p>
              </div>
            </div>

            <div className="custom-scrollbar grid max-h-[60vh] grid-cols-1 gap-6 overflow-y-auto pr-2 md:grid-cols-2">
              {Array.from(
                new Set(completeness.suggestions.map((s) => s.category)),
              ).map((category) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="bg-primary h-1 w-1 rounded-none" />
                    <h4 className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
                      {category}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {completeness.suggestions
                      .filter((s) => s.category === category)
                      .map((s, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "group flex items-center gap-3 rounded-none border p-3 transition-all",
                            s.completed
                              ? "border-emerald-500/10 bg-emerald-500/5 opacity-60"
                              : "bg-background border-border hover:border-primary/30 shadow-sm",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-none transition-transform group-hover:scale-110",
                              s.completed
                                ? "bg-emerald-500/20 text-emerald-600"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {s.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Plus className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "text-[11px] leading-tight font-bold tracking-tight",
                                s.completed
                                  ? "text-emerald-700/70 line-through"
                                  : "text-foreground",
                              )}
                            >
                              {s.text}
                            </span>
                            {!s.completed && (
                              <span className="text-primary/60 text-[9px] font-black uppercase">
                                Impact: +{s.weight}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-primary/5 mt-8 flex items-center justify-between border-t pt-6">
              <p className="text-muted-foreground max-w-50 text-[10px] font-medium">
                Lengkapi semua poin di atas untuk mendapatkan skor maksimal dan
                meningkatkan peluang ATS.
              </p>
              <Button
                className="shadow-primary/20 h-12 rounded-none px-8 font-black tracking-tighter uppercase italic shadow-xl transition-all hover:scale-105 active:scale-95"
                onClick={() => setIsCompletenessOpen(false)}
              >
                GOT IT, LETS GO!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ATS Result Dialog */}
      <Dialog
        open={!!atsResult}
        onOpenChange={(open) => !open && setAtsResult(null)}
      >
        <DialogContent className="bg-background sm:max-w-180">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="text-brand-500 h-6 w-6" />
              {isAnalyzing
                ? "Menganalisis..."
                : "Analisis ATS AI"}
            </DialogTitle>
            <DialogDescription>
              Hasil analisis mendalam untuk mengoptimalkan peluang Anda lolos
              seleksi.
            </DialogDescription>
          </DialogHeader>

          {atsResult && (
            <div className="grid gap-6 py-4 md:grid-cols-2">
              <div className="space-y-6">
                <div className="glass flex flex-col items-center justify-center rounded-none p-6 text-center">
                  <span className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                    ATS Match Score
                  </span>
                  <span
                    className={cn(
                      "text-5xl font-black",
                      atsResult.score >= 80
                        ? "text-emerald-500"
                        : atsResult.score >= 60
                          ? "text-amber-500"
                          : "text-red-500",
                    )}
                  >
                    {atsResult.score}%
                  </span>
                  <p className="text-muted-foreground mt-4 text-xs italic">
                    {atsResult.feedback}
                  </p>
                </div>

                <div className="glass rounded-none p-5">
                  <h4 className="text-muted-foreground mb-3 text-xs font-bold tracking-widest uppercase">
                    Readability
                  </h4>
                  <div className="bg-primary/10 border-primary/5 h-2.5 w-full overflow-hidden rounded-none border">
                    <div
                      className="bg-primary h-full transition-all duration-1000 ease-out"
                      style={{ width: `${atsResult.readabilityScore}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-medium">
                    <span>Sulit</span>
                    <span className="text-primary">
                      {atsResult.readabilityScore}% Sangat Mudah
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Masalah Kritis
                  </h4>
                  <div className="space-y-2">
                    {atsResult.criticalIssues.map((issue: string, i: number) => (
                      <div
                        key={i}
                        className="bg-muted/50 flex items-start gap-3 rounded-none p-3 text-xs"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-none bg-amber-500" />
                        {issue}
                      </div>
                    ))}
                    {atsResult.criticalIssues.length === 0 && (
                      <p className="text-muted-foreground text-xs italic">
                        Tidak ditemukan masalah kritis.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Keyword yang Disarankan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {atsResult.missingKeywords.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-none bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
