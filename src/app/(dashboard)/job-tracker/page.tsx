"use client";

import { useState, useTransition } from "react";
import { Briefcase, Plus, Kanban, Table2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { JOB_STATUS_LABELS, KANBAN_COLUMNS, type JobStatus } from "@/types/job";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  type: string;
  appliedDate?: Date | null;
  createdAt: Date;
}

const STATUS_COLORS: Record<JobStatus, string> = {
  dilamar: "border-blue-500/30 bg-blue-500/5",
  interview: "border-amber-500/30 bg-amber-500/5",
  penawaran: "border-emerald-500/30 bg-emerald-500/5",
  ditolak: "border-red-500/30 bg-red-500/5",
};

const STATUS_BADGE: Record<JobStatus, string> = {
  dilamar: "bg-blue-500/20 text-blue-400",
  interview: "bg-amber-500/20 text-amber-400",
  penawaran: "bg-emerald-500/20 text-emerald-400",
  ditolak: "bg-red-500/20 text-red-400",
};

export default function JobTrackerPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading] = useState(false);

  const getJobsByStatus = (status: JobStatus) =>
    jobs.filter((j) => j.status === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track semua lamaran kerja kamu dalam satu papan
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                view === "kanban"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                view === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Table2 className="h-3.5 w-3.5" />
              Tabel
            </button>
          </div>
          <button
            id="btn-add-job"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Tambah Lamaran
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        </div>
      )}

      {!isLoading && view === "kanban" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {KANBAN_COLUMNS.map((col) => {
            const colJobs = getJobsByStatus(col.id);
            return (
              <div
                key={col.id}
                className={`rounded-2xl border p-4 ${STATUS_COLORS[col.id]}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_BADGE[col.id]}`}>
                    {colJobs.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colJobs.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border py-8 text-center">
                      <Briefcase className="mx-auto mb-2 h-5 w-5 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground">Belum ada lamaran</p>
                    </div>
                  )}
                  {colJobs.map((job) => (
                    <div
                      key={job.id}
                      className="glass cursor-pointer rounded-xl p-4 transition-all hover:border-primary/20"
                    >
                      <div className="font-semibold text-foreground text-sm">{job.position}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{job.company}</div>
                      {job.appliedDate && (
                        <div className="mt-2 text-xs text-surface-300">
                          {formatDate(job.appliedDate)}
                        </div>
                      )}
                      <div className="mt-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {job.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && view === "table" && (
        <div className="glass overflow-hidden rounded-2xl">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Briefcase className="mb-3 h-10 w-10 text-surface-400" />
              <p className="text-sm text-surface-300">Belum ada lamaran kerja</p>
              <button className="mt-4 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">
                <Plus className="h-4 w-4" />
                Tambah Lamaran Pertama
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Posisi", "Perusahaan", "Tipe", "Status", "Tanggal", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-white/5 hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{job.position}</td>
                    <td className="px-4 py-3 text-surface-300">{job.company}</td>
                    <td className="px-4 py-3 text-surface-300">{job.type}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[job.status]}`}>
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-300">
                      {job.appliedDate ? formatDate(job.appliedDate) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-surface-300 hover:text-white">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
