import { z } from "zod";

import { coverLetterContentSchema } from "./types/cover-letter-content";

export const updateCoverLetterSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: coverLetterContentSchema.optional(),
});

export type UpdateCoverLetterInput = z.infer<typeof updateCoverLetterSchema>;

export const createCoverLetterSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

export type CreateCoverLetterInput = z.infer<typeof createCoverLetterSchema>;
