import { z } from "zod";

import { COVER_LETTER_TEMPLATE_IDS } from "@/types/cover-letter";

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
  style: z
    .object({
      fontFamily: z.string().default("Inter"),
      fontSize: z.string().default("11px"),
      lineHeight: z.string().optional(),
      density: z.enum(["compact", "normal", "comfortable"]).optional(),
      uppercaseHeaders: z.boolean().optional(),
      language: z.enum(["id", "en"]).optional(),
      paperSize: z.enum(["A4", "letter"]).optional(),
      templateId: z.enum(COVER_LETTER_TEMPLATE_IDS).default("classic"),
    })
    .default({
      fontFamily: "Inter",
      fontSize: "11px",
      templateId: "classic",
    }),
});

export type CoverLetterBuilderData = z.infer<typeof coverLetterContentSchema>;
