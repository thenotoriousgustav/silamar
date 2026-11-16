export type JobType =
  | "full-time"
  | "part-time"
  | "internship"
  | "contract"
  | "freelance";

export type JobStatus = "dilamar" | "interview" | "penawaran" | "ditolak";

export type JobApplicationDTO = {
  id: string;
  trackerId: string | null;
  resumeId: string | null;
  coverLetterId: string | null;
  company: string;
  position: string;
  location: string | null;
  logoUrl: string | null;
  salary: string | null;
  type: JobType;
  status: JobStatus;
  appliedDate: Date | null;
  interviewDate: Date | null;
  offerDate: Date | null;
  notes: string | null;
  jobUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
