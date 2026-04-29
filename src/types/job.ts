export type JobType =
  | "full-time"
  | "part-time"
  | "internship"
  | "contract"
  | "freelance";

export type JobStatus = "dilamar" | "interview" | "penawaran" | "ditolak";

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  position: string;
  logoUrl?: string | null;
  salary?: string | null;
  location?: string | null;
  type: JobType;
  status: JobStatus;
  appliedDate?: Date | null;
  interviewDate?: Date | null;
  offerDate?: Date | null;
  notes?: string | null;
  jobUrl?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobApplicationInput {
  company: string;
  position: string;
  logoUrl?: string;
  salary?: string;
  type: JobType;
  status?: JobStatus;
  appliedDate?: string;
  interviewDate?: string;
  offerDate?: string;
  notes?: string;
  jobUrl?: string;
  description?: string;
}

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
