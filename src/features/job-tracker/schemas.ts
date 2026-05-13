import { z } from "zod";

export const createJobApplicationSchema = z.object({
  company: z.string().min(1, "Nama perusahaan wajib diisi").max(200),
  position: z.string().min(1, "Posisi pekerjaan wajib diisi").max(200),
  location: z.string().max(200).optional(),
  trackerId: z.string().optional().nullable(),
  type: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
  ]),
  status: z
    .enum(["dilamar", "interview", "penawaran", "ditolak"])
    .default("dilamar"),
  jobUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  salary: z.string().max(100).optional(),
  appliedDate: z.string().optional(),
  interviewDate: z.string().optional(),
  offerDate: z.string().optional(),
  resumeId: z.string().optional().nullable(),
  description: z.string().max(5000).optional(),
  notes: z.string().max(2000).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;

export const updateJobApplicationSchema = z.object({
  company: z.string().min(1).max(200).optional(),
  position: z.string().min(1).max(200).optional(),
  location: z.string().max(200).optional().nullable(),
  trackerId: z.string().optional().nullable(),
  type: z
    .enum(["full-time", "part-time", "internship", "contract", "freelance"])
    .optional(),
  status: z
    .enum(["dilamar", "interview", "penawaran", "ditolak"])
    .optional(),
  jobUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  salary: z.string().max(100).optional().nullable(),
  appliedDate: z.string().optional(),
  interviewDate: z.string().optional().nullable(),
  offerDate: z.string().optional().nullable(),
  resumeId: z.string().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  logoUrl: z.string().url().optional().or(z.literal("")).nullable(),
});

export type UpdateJobApplicationInput = z.infer<
  typeof updateJobApplicationSchema
>;

export const createTrackerSchema = z.object({
  name: z.string().min(1, "Nama tracker wajib diisi").max(200),
  description: z.string().max(1000).optional(),
});

export type CreateTrackerInput = z.infer<typeof createTrackerSchema>;

export const updateTrackerSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
});

export type UpdateTrackerInput = z.infer<typeof updateTrackerSchema>;

/**
 * Form-specific schema used by the job form drawer component.
 * Uses Date objects for calendar fields (appliedDate, interviewDate)
 * since the Calendar component requires Date values.
 */
export const jobApplicationFormSchema = z.object({
  company: z.string().min(1, "Nama perusahaan wajib diisi").max(200),
  position: z.string().min(1, "Posisi pekerjaan wajib diisi").max(200),
  location: z.string().max(200).optional(),
  trackerId: z.string().optional().nullable(),
  type: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
  ]),
  status: z.enum(["dilamar", "interview", "penawaran", "ditolak"]),
  jobUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  salary: z.string().max(100).optional(),
  appliedDate: z.date().optional(),
  interviewDate: z.date().optional(),
  resumeId: z.string().optional().nullable(),
  description: z.string().max(5000).optional(),
});

export type JobApplicationFormValues = z.infer<typeof jobApplicationFormSchema>;

/**
 * Re-export the form schema for backward compatibility with components
 * that use the old `jobApplicationSchema` name.
 */
export const jobApplicationSchema = jobApplicationFormSchema;
export type CreateTrackerFormValues = CreateTrackerInput;
