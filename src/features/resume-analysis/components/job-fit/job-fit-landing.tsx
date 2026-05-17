"use client";

import { ArrowLeft, Briefcase, Clock, History, Sparkles, Target } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { JobForSelect } from "@/features/cover-letters-list/actions/get-jobs-for-select";

import type { JobFitHistoryItem } from "../../actions/get-job-fit-history";

const MANUAL_JOB_VALUE = "__manual__";

export interface JobFitFormState {
  resumeId: string;
  jobSource: "manual" | "tracker";
  selectedJobId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}

export interface ResumeOption {
  id: string;
  title: string | null;
  atsScore?: number | null;
}

interface JobFitLandingProps {
  resumes: ResumeOption[];
  jobs: JobForSelect[];
  isLoadingResumes: boolean;
  isLoadingJobs: boolean;
  form: JobFitFormState;
  onChange: (next: JobFitFormState) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  backUrl: string;
  history?: JobFitHistoryItem[];
  onSelectHistory?: (item: JobFitHistoryItem) => void;
}

/**
 * Landing screen shown before a job-fit analysis has been run.
 * Lets the user pick a resume and either select a tracked job or paste a JD.
 */
export function JobFitLanding({
  resumes,
  jobs,
  isLoadingResumes,
  isLoadingJobs,
  form,
  onChange,
  onSubmit,
  isSubmitting,
  backUrl,
  history = [],
  onSelectHistory,
}: JobFitLandingProps) {
  const update = (patch: Partial<JobFitFormState>) =>
    onChange({ ...form, ...patch });

  const isValid =
    form.resumeId.length > 0 &&
    (form.jobDescription.trim().length >= 50 ||
      (form.jobSource === "tracker" && form.selectedJobId.length > 0));

  return (
    <div className="custom-scrollbar h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl space-y-6 p-6 pb-12">
        <div>
          <Link href={backUrl}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>

        {history.length > 0 && onSelectHistory && (
          <div className="border-border space-y-2 border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="text-muted-foreground h-3.5 w-3.5" />
                <h3 className="text-[11px] font-bold tracking-wider uppercase">
                  Riwayat Analisis
                </h3>
              </div>
              <span className="text-muted-foreground text-[10px]">
                {history.length} hasil tersimpan
              </span>
            </div>
            <ul className="space-y-1">
              {history.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectHistory(item)}
                    className="border-border/50 hover:bg-muted/40 flex w-full items-center justify-between gap-2 border p-2 text-left transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold">
                        {item.jobTitle || "Tanpa Judul"}
                        {item.company && (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            · {item.company}
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1 text-[10px]">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(item.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 text-[10px] font-bold ${
                        item.matchScore >= 70
                          ? "bg-emerald-500/10 text-emerald-600"
                          : item.matchScore >= 40
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {item.matchScore}/100
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-border space-y-6 border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Analisis Kecocokan Pekerjaan</h1>
              <p className="text-muted-foreground text-sm">
                Cek apakah resume kamu benar-benar cocok untuk posisi tertentu
              </p>
            </div>
          </div>

          {/* Resume picker */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold tracking-wider uppercase">
              1. Pilih Resume
            </Label>
            <Select
              value={form.resumeId}
              onValueChange={(v) => update({ resumeId: v })}
              disabled={isLoadingResumes || resumes.length === 0}
            >
              <SelectTrigger className="h-10 w-full text-sm">
                <SelectValue
                  placeholder={
                    isLoadingResumes
                      ? "Memuat resume..."
                      : resumes.length === 0
                        ? "Belum ada resume"
                        : "Pilih resume yang ingin dianalisis"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">
                        {r.title || "Untitled Resume"}
                      </span>
                      {r.atsScore != null && (
                        <span className="text-muted-foreground text-[10px]">
                          ATS {r.atsScore}%
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job source picker */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold tracking-wider uppercase">
              2. Sumber Pekerjaan
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  update({ jobSource: "tracker", jobTitle: "", company: "", jobDescription: "" })
                }
                className={`flex flex-1 items-center justify-center gap-2 border px-3 py-2 text-xs font-bold transition-colors ${
                  form.jobSource === "tracker"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                Dari Job Tracker
              </button>
              <button
                type="button"
                onClick={() =>
                  update({
                    jobSource: "manual",
                    selectedJobId: "",
                    jobTitle: "",
                    company: "",
                    jobDescription: "",
                  })
                }
                className={`flex flex-1 items-center justify-center gap-2 border px-3 py-2 text-xs font-bold transition-colors ${
                  form.jobSource === "manual"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Tempel Manual
              </button>
            </div>
          </div>

          {/* Tracker job select */}
          {form.jobSource === "tracker" && (
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold tracking-wider uppercase">
                3. Pilih Lowongan
              </Label>
              <Select
                value={form.selectedJobId || MANUAL_JOB_VALUE}
                onValueChange={(v) => {
                  if (v === MANUAL_JOB_VALUE) return;
                  const j = jobs.find((x) => x.id === v);
                  update({
                    selectedJobId: v,
                    jobTitle: j?.position ?? "",
                    company: j?.company ?? "",
                    jobDescription: j?.description ?? "",
                  });
                }}
                disabled={isLoadingJobs || jobs.length === 0}
              >
                <SelectTrigger className="h-10 w-full text-sm">
                  <SelectValue
                    placeholder={
                      isLoadingJobs
                        ? "Memuat lowongan..."
                        : jobs.length === 0
                          ? "Belum ada lowongan di Job Tracker"
                          : "Pilih lowongan dari Job Tracker"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      <span className="flex flex-col items-start">
                        <span className="font-medium">{j.position}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {j.company}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {form.selectedJobId && form.jobDescription && (
                <div className="bg-muted/30 border-border/50 mt-2 max-h-32 overflow-y-auto border p-2 text-[11px] leading-relaxed text-muted-foreground">
                  {form.jobDescription.slice(0, 600)}
                  {form.jobDescription.length > 600 && "..."}
                </div>
              )}
            </div>
          )}

          {/* Manual job inputs */}
          {form.jobSource === "manual" && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold tracking-wider uppercase">
                    Posisi
                  </Label>
                  <Input
                    value={form.jobTitle}
                    onChange={(e) => update({ jobTitle: e.target.value })}
                    placeholder="cth. Senior Backend Engineer"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold tracking-wider uppercase">
                    Perusahaan
                  </Label>
                  <Input
                    value={form.company}
                    onChange={(e) => update({ company: e.target.value })}
                    placeholder="cth. Tokopedia"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold tracking-wider uppercase">
                  Deskripsi Pekerjaan
                </Label>
                <Textarea
                  value={form.jobDescription}
                  onChange={(e) => update({ jobDescription: e.target.value })}
                  rows={10}
                  placeholder="Tempel deskripsi pekerjaan lengkap di sini (responsibilities, requirements, qualifications)..."
                  className="resize-none font-mono text-xs"
                />
                <p className="text-muted-foreground text-[10px]">
                  Minimal 50 karakter. Semakin lengkap, semakin akurat hasilnya.
                </p>
              </div>
            </div>
          )}

          {/* What we evaluate */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="text-[10px] font-bold tracking-wider uppercase">
              Yang dievaluasi:
            </h3>
            <ul className="text-muted-foreground space-y-1 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1 w-1 shrink-0" />
                Kecocokan domain / bidang pekerjaan
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1 w-1 shrink-0" />
                Kesesuaian senioritas dan tahun pengalaman
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1 w-1 shrink-0" />
                Skill wajib vs nice-to-have
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1 w-1 shrink-0" />
                Keyword cocok dan yang hilang
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary h-1 w-1 shrink-0" />
                Verdict jujur: apply atau jangan
              </li>
            </ul>
          </div>

          <Button
            onClick={onSubmit}
            disabled={!isValid || isSubmitting}
            className="h-12 w-full text-sm font-bold"
          >
            <Target className="mr-2 h-4 w-4" />
            Mulai Analisis Kecocokan (1 Kredit)
          </Button>
        </div>
      </div>
    </div>
  );
}
