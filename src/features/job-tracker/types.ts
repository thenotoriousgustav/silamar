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
  resumeId?: string | null;
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
  resumeId?: string | null;
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
