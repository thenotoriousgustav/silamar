"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { BarChart3, FileText, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { analyzeResumeSchema } from "../schemas";
import type { AnalyzeResumeInput } from "../schemas";
import type { ResumeAnalysisDTO } from "../types/resume-analysis-dto";

import { ResumeAnalysisResults } from "./resume-analysis-results";

export function ResumeAnalysisClient() {
  const [result, setResult] = useState<ResumeAnalysisDTO | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: AnalyzeResumeInput) => {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent: data.resumeContent }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menganalisis resume");
      return json.data as ResumeAnalysisDTO;
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
  } = useForm<AnalyzeResumeInput>({
    resolver: zodResolver(analyzeResumeSchema),
  });

  const onSubmit = (data: AnalyzeResumeInput) => {
    mutation.mutate(data);
  };

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

          {result && <ResumeAnalysisResults result={result} />}
        </div>
      </div>
    </div>
  );
}
