"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Target, Plus, X, Loader2, Sparkles, TrendingUp, BookOpen } from "lucide-react";
import type { SkillGapResult } from "@/lib/ai/prompts/skill-gap";

const schema = z.object({
  skills: z.array(z.string()).min(1, "Minimal 1 skill"),
  jobTitle: z.string().min(2, "Posisi wajib diisi"),
  jobDescription: z.string().min(50, "Deskripsi pekerjaan minimal 50 karakter"),
});

type FormData = z.infer<typeof schema>;

const PRIORITY_COLORS = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const PRIORITY_LABELS = { high: "Kritis", medium: "Penting", low: "Tambahan" };

export default function SkillGapPage() {
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menganalisis skill gap");
      return json.data;
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Analisis selesai! 🎯");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Terjadi kesalahan. Coba lagi.");
    },
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { skills: [] },
  });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      setValue("skills", updated);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    setValue("skills", updated);
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const gapColor = (score: number) =>
    score >= 70 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Skill Gap Analysis</h1>
        <p className="mt-1 text-sm text-surface-300">
          Temukan skill yang perlu dipelajari untuk posisi impianmu · <span className="text-brand-400">1 kredit</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Posisi Target *
              </label>
              <input
                {...register("jobTitle")}
                id="input-job-title"
                placeholder="Frontend Developer"
                className="w-full rounded-xl border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              {errors.jobTitle && <p className="mt-1 text-xs text-red-400">{errors.jobTitle.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Skill yang Dimiliki *
              </label>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  id="input-skill"
                  placeholder="Tambah skill (Enter)"
                  className="flex-1 rounded-xl border border-white/10 bg-surface-800 px-4 py-2.5 text-sm text-white placeholder-surface-300 outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-surface-700 px-3 py-2.5 text-surface-300 hover:bg-surface-600 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.skills && <p className="mt-1 text-xs text-red-400">Minimal 1 skill harus diisi</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-200">
                Deskripsi Pekerjaan *
              </label>
              <textarea
                {...register("jobDescription")}
                id="textarea-jd"
                rows={8}
                placeholder="Tempel deskripsi pekerjaan dari lowongan..."
                className="w-full resize-none rounded-xl border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white placeholder-surface-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              {errors.jobDescription && <p className="mt-1 text-xs text-red-400">{errors.jobDescription.message}</p>}
            </div>

            <button
              type="submit"
              id="btn-analyze-skill-gap"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition-all hover:bg-brand-500 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Menganalisis...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Analisis Skill Gap (1 Kredit)</>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !mutation.isPending && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <Target className="mb-3 h-10 w-10 text-surface-400" />
              <p className="text-sm text-surface-300">Hasil analisis akan muncul di sini</p>
            </div>
          )}

          {mutation.isPending && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-500/30 bg-brand-500/5 py-20 text-center">
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-brand-400" />
              <p className="text-sm text-brand-400">AI sedang menganalisis...</p>
            </div>
          )}

          {result && (
            <>
              {/* Gap Score */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Kesiapan</h3>
                  <span className={`text-3xl font-extrabold ${gapColor(result.overallGapScore)}`}>
                    {result.overallGapScore}%
                  </span>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-surface-700">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.overallGapScore >= 70 ? "bg-emerald-500" :
                      result.overallGapScore >= 50 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${result.overallGapScore}%` }}
                  />
                </div>
                <p className="text-sm text-surface-300">{result.verdict}</p>
                <div className="mt-3 text-xs text-brand-400 font-medium">
                  ⏱ Estimasi siap: {result.estimatedTimeToReady}
                </div>
              </div>

              {/* Missing Skills */}
              {result.missingSkills.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                    Skill yang Perlu Dipelajari
                  </h3>
                  <div className="space-y-3">
                    {result.missingSkills.map((skill, i) => (
                      <div key={i} className={`rounded-xl border p-3 ${PRIORITY_COLORS[skill.priority]}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{skill.skill}</span>
                          <span className={`text-xs font-semibold ${PRIORITY_COLORS[skill.priority].split(" ")[1]}`}>
                            {PRIORITY_LABELS[skill.priority]}
                          </span>
                        </div>
                        <p className="text-xs text-surface-300">{skill.howToLearn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Path */}
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                  <BookOpen className="h-4 w-4 text-brand-400" />
                  Learning Path
                </h3>
                <ol className="space-y-2">
                  {result.learningPath.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-surface-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-xs font-bold text-brand-400">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Matched Skills */}
              {result.matchedSkills.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="mb-3 text-sm font-semibold text-white">✅ Skill yang Sudah Relevan</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.map((skill) => (
                      <span key={skill} className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
