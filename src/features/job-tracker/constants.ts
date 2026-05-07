import { JobStatus, JobType } from "./types";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  dilamar: "Dilamar",
  interview: "Interview",
  penawaran: "Penawaran",
  ditolak: "Ditolak",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  dilamar: "blue",
  interview: "amber",
  penawaran: "green",
  ditolak: "red",
};

export const STATUS_COLORS: Record<JobStatus, string> = {
  dilamar: "border-blue-500/20 bg-blue-500/5",
  interview: "border-amber-500/20 bg-amber-500/5",
  penawaran: "border-green-500/20 bg-green-500/5",
  ditolak: "border-destructive/20 bg-destructive/5",
};

export const STATUS_BADGE: Record<JobStatus, string> = {
  dilamar: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  interview: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  penawaran: "bg-green-500/10 text-green-500 border-green-500/20",
  ditolak: "bg-destructive/10 text-destructive border-destructive/20",
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  "full-time": "Full Time",
  "part-time": "Part Time",
  internship: "Magang",
  contract: "Kontrak",
  freelance: "Freelance",
};

export const KANBAN_COLUMNS: { id: JobStatus; label: string }[] = [
  { id: "dilamar", label: "Dilamar" },
  { id: "interview", label: "Interview" },
  { id: "penawaran", label: "Penawaran" },
  { id: "ditolak", label: "Ditolak" },
];

export const VIEW_PREFERENCE_KEY = "job-tracker-view";
export const COLUMN_ORDER_KEY = "job-tracker-column-order";
