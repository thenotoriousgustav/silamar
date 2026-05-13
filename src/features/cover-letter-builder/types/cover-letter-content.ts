import { z } from "zod";

export const coverLetterContentSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string().optional(),
  cityAndPostal: z.string().optional(),
  recipientName: z.string().optional(),
  companyName: z.string().optional(),
  department: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientCityAndPostal: z.string().optional(),
  subject: z.string().optional(),
  content: z.string().optional(),
});

export type CoverLetterBuilderData = z.infer<typeof coverLetterContentSchema>;
