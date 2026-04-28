"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BarChart3, Upload, FileText, Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import type { ResumeAnalyzeResult } from "@/lib/ai/prompts/resume-analyze";

const schema = z.object({
  resumeContent: z
    .string()
    .min(100, "Resume terlalu pendek. Minimal 100 karakter."),
});

type FormData = z.infer<typeof schema>;

export default function ResumeAnalysisPage() {
  const [result, setResult] = useState<ResumeAnalyzeResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeContent: data.resumeContent }),
        });

        const json = await res.json();

        if (!res.ok) {
          toast.error(json.error ?? "Gagal menganalisis resume");
          return;
        }

        setResult(json.data);
        toast.success("Analisis selesai! 🎉");
      } catch {
        toast.error("Terjadi kesalahan. Coba lagi.");
      }
    });
  };

  const scoreColor = (score: number) =>
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";

  const scoreBg = (score: number) =>
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analisis Resume AI</h1>
        <p className="mt-1 text-sm text-surface-300">
          Dapatkan skor ATS dan saran perbaikan dari AI · <span className="text-brand-400">1 kredit</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="h-4 w-4 text-brand-400" />
            Tempel Konten Resume
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <textarea
                {...register("resumeContent")}
                id="textarea-resume-content"
                rows={16}
                placeholder="Tempel isi resume kamu di sini (nama, pengalaman, pendidikan, skill, dll)..."
                className="w-full resize-none rounded-xl border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-surface-300 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-mono"
              />
              {errors.resumeContent && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.resumeContent.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              id="btn-analyze-resume"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-600/30 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analisis Resume (1 Kredit)
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !isPending && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <BarChart3 className="mb-3 h-10 w-10 text-surface-400" />
              <p className="text-sm text-surface-300">
                Hasil analisis akan muncul di sini
              </p>
            </div>
          )}

          {isPending && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-500/30 bg-brand-500/5 py-20 text-center">
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-brand-400" />
              <p className="text-sm text-brand-400">AI sedang menganalisis resume kamu...</p>
            </div>
          )}

          {result && (
            <>
              {/* ATS Score */}
              <div className="glass rounded-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Skor ATS</h3>
                  <span className={`text-3xl font-extrabold ${scoreColor(result.atsScore)}`}>
                    {result.atsScore}%
                  </span>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-surface-700">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${scoreBg(result.atsScore)}`}
                    style={{ width: `${result.atsScore}%` }}
                  />
                </div>
                <p className="text-sm text-surface-300">{result.overallFeedback}</p>
              </div>

              {/* Section Scores */}
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-4 text-sm font-semibold text-white">Skor per Seksi</h3>
                <div className="space-y-3">
                  {Object.entries(result.sectionScores).map(([section, score]) => (
                    <div key={section} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-surface-300 capitalize">{section}</span>
                      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-surface-700">
                        <div
                          className={`h-full rounded-full ${scoreBg(score as number)}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={`w-10 text-right text-xs font-medium ${scoreColor(score as number)}`}>
                        {score as number}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Kekuatan
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Perlu Diperbaiki
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-3 text-sm font-semibold text-white">Keyword yang Disarankan</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywordSuggestions.map((kw) => (
                    <span key={kw} className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
