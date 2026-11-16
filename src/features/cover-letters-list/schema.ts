import { z } from "zod";

export const coverLetterBuilderSchema = z.object({
  // From (Sender)
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid"),
  address: z.string().optional(),
  cityAndPostal: z.string().optional(),

  // To (Recipient)
  recipientName: z.string().optional(),
  companyName: z.string().optional(),
  department: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientCityAndPostal: z.string().optional(),

  // Content
  subject: z.string().optional(),
  content: z.string().optional(),
});

export type CoverLetterBuilderData = z.infer<typeof coverLetterBuilderSchema>;
