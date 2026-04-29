"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  BarChart3,
  Upload,
  FileText,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { ResumeAnalyzeResult } from "@/lib/ai/prompts/resume-analyze";

const schema = z.object({
  resumeContent: z
    .string()
    .min(100, "Resume terlalu pendek. Minimal 100 karakter."),
});

type FormData = z.infer<typeof schema>;

export default function ResumeAnalysisPage() {
  const [result, setResult] = useState<ResumeAnalyzeResult | null>(null);
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent: data.resumeContent }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menganalisis resume");
      return json.data;
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Analisis selesai! 🎉");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Terjadi kesalahan. Coba lagi.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const scoreColor = (score: number) =>
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-amber-400"
        : "text-red-400";

  const scoreBg = (score: number) =>
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analisis Resume AI</h1>
        <p className="text-surface-300 mt-1 text-sm">
          Dapatkan skor ATS dan saran perbaikan dari AI ·{" "}
          <span className="text-brand-400">1 kredit</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="glass rounded-none p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="text-brand-400 h-4 w-4" />
            Tempel Konten Resume
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <textarea
                {...register("resumeContent")}
                id="textarea-resume-content"
                rows={16}
                placeholder="Tempel isi resume kamu di sini (nama, pengalaman, pendidikan, skill, dll)..."
                className="bg-surface-800 placeholder-surface-300 focus:border-brand-500 focus:ring-brand-500/20 w-full resize-none rounded-none border border-white/10 px-4 py-3 font-mono text-sm text-white transition-all outline-none focus:ring-2"
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
              disabled={mutation.isPending}
              className="bg-brand-600 hover:bg-brand-500 hover:shadow-brand-600/30 flex w-full items-center justify-center gap-2 rounded-none py-3 text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {mutation.isPending ? (
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
          {!result && !mutation.isPending && (
            <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-white/10 py-20 text-center">
              <BarChart3 className="text-surface-400 mb-3 h-10 w-10" />
              <p className="text-surface-300 text-sm">
                Hasil analisis akan muncul di sini
              </p>
            </div>
          )}

          {mutation.isPending && (
            <div className="border-brand-500/30 bg-brand-500/5 flex flex-col items-center justify-center rounded-none border border-dashed py-20 text-center">
              <Loader2 className="text-brand-400 mb-3 h-10 w-10 animate-spin" />
              <p className="text-brand-400 text-sm">
                AI sedang menganalisis resume kamu...
              </p>
            </div>
          )}

          {result && (
            <>
              {/* ATS Score */}
              <div className="glass rounded-none p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Skor ATS</h3>
                  <span
                    className={`text-3xl font-extrabold ${scoreColor(result.atsScore)}`}
                  >
                    {result.atsScore}%
                  </span>
                </div>
                <div className="bg-surface-700 mb-3 h-2 overflow-hidden rounded-none">
                  <div
                    className={`h-full rounded-none transition-all duration-1000 ${scoreBg(result.atsScore)}`}
                    style={{ width: `${result.atsScore}%` }}
                  />
                </div>
                <p className="text-surface-300 text-sm">
                  {result.overallFeedback}
                </p>
              </div>

              {/* Section Scores */}
              <div className="glass rounded-none p-6">
                <h3 className="mb-4 text-sm font-semibold text-white">
                  Skor per Seksi
                </h3>
                <div className="space-y-3">
                  {Object.entries(result.sectionScores).map(
                    ([section, score]) => (
                      <div key={section} className="flex items-center gap-3">
                        <span className="text-surface-300 w-24 text-xs capitalize">
                          {section}
                        </span>
                        <div className="bg-surface-700 h-1.5 flex-1 overflow-hidden rounded-none">
                          <div
                            className={`h-full rounded-none ${scoreBg(score as number)}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span
                          className={`w-10 text-right text-xs font-medium ${scoreColor(score as number)}`}
                        >
                          {score as number}%
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Strengths */}
              <div className="glass rounded-none p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Kekuatan
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="text-surface-300 flex items-start gap-2 text-sm"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-none bg-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="glass rounded-none p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Perlu Diperbaiki
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li
                      key={i}
                      className="text-surface-300 flex items-start gap-2 text-sm"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-none bg-amber-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              <div className="glass rounded-none p-6">
                <h3 className="mb-3 text-sm font-semibold text-white">
                  Keyword yang Disarankan
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywordSuggestions.map((kw) => (
                    <span
                      key={kw}
                      className="bg-brand-500/10 text-brand-400 rounded-none px-3 py-1 text-xs font-medium"
                    >
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
