import { z } from "zod";

export const createResumeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
  content: z.record(z.string(), z.unknown()).default({}),
});

export const createEmptyResumeSchema = z.object({
  templateId: z
    .enum(["classic", "modern", "minimal", "creative"])
    .default("classic"),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  atsScore: z.number().min(0).max(100).nullable().optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type CreateEmptyResumeInput = z.infer<typeof createEmptyResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
