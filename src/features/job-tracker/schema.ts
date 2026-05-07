import * as z from "zod";

export const jobApplicationSchema = z.object({
  company: z.string().min(1, "Nama perusahaan wajib diisi"),
  position: z.string().min(1, "Posisi pekerjaan wajib diisi"),
  location: z.string().optional(),
  status: z.enum(["dilamar", "interview", "penawaran", "ditolak"]),
  trackerId: z.string().optional().nullable(),
  type: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
  ]),
  jobUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  salary: z.string().optional(),
  appliedDate: z.date().optional(),
  interviewDate: z.date().optional(),
  resumeId: z.string().optional().nullable(),
  description: z.string().optional(),
});

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

export const createTrackerSchema = z.object({
  name: z.string().min(1, "Nama tracker wajib diisi"),
  description: z.string().optional(),
});

export type CreateTrackerFormValues = z.infer<typeof createTrackerSchema>;
