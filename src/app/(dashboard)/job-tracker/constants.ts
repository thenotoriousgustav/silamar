import { JobStatus } from "@/types/job";

export const STATUS_COLORS: Record<JobStatus, string> = {
  dilamar: "border-blue-500/30 bg-blue-500/5",
  interview: "border-amber-500/30 bg-amber-500/5",
  penawaran: "border-emerald-500/30 bg-emerald-500/5",
  ditolak: "border-red-500/30 bg-red-500/5",
};

export const STATUS_BADGE: Record<JobStatus, string> = {
  dilamar: "bg-blue-500/20 text-blue-400",
  interview: "bg-amber-500/20 text-amber-400",
  penawaran: "bg-emerald-500/20 text-emerald-400",
  ditolak: "bg-red-500/20 text-red-400",
};

export const COLUMN_ORDER_KEY = "silamar-job-tracker-column-order";
export const VIEW_PREFERENCE_KEY = "silamar-job-tracker-view";
