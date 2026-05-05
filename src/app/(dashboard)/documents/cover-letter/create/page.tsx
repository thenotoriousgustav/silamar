"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Loader2, Sparkles, Copy, Check } from "lucide-react";
import type { CoverLetterResult } from "@/lib/ai/prompts/cover-letter";

const schema = z.object({
  resumeContent: z.string().min(100, "Resume minimal 100 karakter"),
  jobTitle: z.string().min(2, "Posisi wajib diisi"),
  company: z.string().min(2, "Perusahaan wajib diisi"),
  jobDescription: z.string().optional(),
  tone: z.enum(["formal", "friendly", "professional"]),
});

type FormData = z.infer<typeof schema>;

export default function CoverLetterPage() {
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState(false);
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, saveLetter: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal generate cover letter");
      return json.data;
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Cover letter berhasil dibuat! ✍️");
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
    defaultValues: { tone: "professional" },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Disalin ke clipboard!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          AI Cover Letter Generator
        </h1>
        <p className="mt-1 text-sm text-surface-300">
          Generate surat lamaran yang personal dalam hitungan detik ·{" "}
          <span className="text-brand-400">1 kredit</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="glass rounded-none p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Posisi yang Dilamar *
              </label>
              <input
                {...register("jobTitle")}
                id="input-job-title"
                placeholder="Frontend Developer"
                className="w-full rounded-none border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Nama Perusahaan *
              </label>
              <input
                {...register("company")}
                id="input-company"
                placeholder="PT Gojek Indonesia"
                className="w-full rounded-none border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Tone Surat
              </label>
              <select
                {...register("tone")}
                id="select-tone"
                className="w-full rounded-none border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white outline-none focus:border-brand-500"
              >
                <option value="professional">Professional</option>
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Konten Resume *
              </label>
              <textarea
                {...register("resumeContent")}
                id="textarea-resume"
                rows={8}
                placeholder="Tempel isi resume kamu..."
                className="w-full resize-none rounded-none border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              {errors.resumeContent && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.resumeContent.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Deskripsi Pekerjaan (opsional)
              </label>
              <textarea
                {...register("jobDescription")}
                id="textarea-jd"
                rows={4}
                placeholder="Tempel JD dari lowongan untuk hasil lebih personal..."
                className="w-full resize-none rounded-none border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <button
              type="submit"
              id="btn-generate-cover-letter"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-none bg-brand-600 py-3 text-sm font-bold text-white transition-all hover:bg-brand-500 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Cover Letter (1
                  Kredit)
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {!result && !mutation.isPending && (
            <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-white/10 py-20 text-center">
              <Mail className="mb-3 h-10 w-10 text-surface-400" />
              <p className="text-sm text-surface-300">
                Cover letter akan muncul di sini
              </p>
            </div>
          )}

          {mutation.isPending && (
            <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-brand-500/30 bg-brand-500/5 py-20 text-center">
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-brand-400" />
              <p className="text-sm text-brand-400">
                AI sedang menulis cover letter...
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="glass rounded-none p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Subjek Email
                  </h3>
                </div>
                <p className="rounded-none bg-surface-800 px-4 py-2.5 text-sm text-white font-medium">
                  {result.subject}
                </p>
              </div>

              <div className="glass rounded-none p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Surat Lamaran
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-none bg-surface-800 px-3 py-1.5 text-xs font-medium text-surface-300 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Disalin!" : "Salin"}
                  </button>
                </div>
                <div className="rounded-none bg-surface-800 p-4 text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
                  {result.coverLetter}
                </div>
              </div>

              {result.tips.length > 0 && (
                <div className="glass rounded-none p-6">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    Tips Tambahan
                  </h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-surface-300"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-none bg-brand-400" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
