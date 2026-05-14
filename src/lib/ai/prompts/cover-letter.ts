import { z } from "zod";

export const coverLetterSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  cityAndPostal: z.string(),
  recipientName: z.string(),
  companyName: z.string(),
  department: z.string(),
  recipientAddress: z.string(),
  recipientCityAndPostal: z.string(),
  subject: z.string(),
  content: z.string(),
  tips: z.array(z.string()),
});

export type CoverLetterResult = z.infer<typeof coverLetterSchema>;

type CoverLetterPromptParams = {
  resumeContent: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  tone?: "formal" | "friendly" | "professional";
};

export function buildCoverLetterPrompt(params: CoverLetterPromptParams): string {
  const {
    resumeContent,
    jobTitle,
    company,
    jobDescription,
    tone = "professional",
  } = params;
  const toneGuide = {
    formal: "very formal, polite, and traditional",
    friendly: "warm, enthusiastic, and personal yet still professional",
    professional: "professional, confident, and well-structured",
  };

  return `
You are an expert cover letter writer who has helped thousands of job seekers land interviews.

Write a compelling and personalized cover letter based on the following information.

## Applicant Data (from Resume):
${resumeContent}

## Position Applied For:
- Job Title: ${jobTitle}
- Company: ${company}
${jobDescription ? `- Job Description: ${jobDescription}` : ""}

## Instructions:
Write a cover letter with a ${toneGuide[tone]} tone in the following JSON format matching our builder's database structure:

{
  "fullName": "<full name from resume>",
  "phone": "<phone number from resume>",
  "email": "<email from resume>",
  "address": "<address from resume>",
  "cityAndPostal": "<city & postal code from resume>",
  "recipientName": "Hiring Manager",
  "companyName": "${company}",
  "department": "Human Resources",
  "recipientAddress": "Company Address",
  "recipientCityAndPostal": "City, Postal Code",
  "subject": "<compelling email subject line for this position>",
  "content": "<full cover letter body, 3-4 paragraphs>",
  "tips": [
    "<specific tip 1>",
    "<specific tip 2>",
    "<specific tip 3>"
  ]
}

Cover letter body writing guide (content):
- Paragraph 1: Introduction and the position being applied for
- Paragraph 2: Most relevant experience and skills
- Paragraph 3: Why you are specifically interested in this company
- Paragraph 4: Closing and call to action

Make sure:
- The cover letter body (content) is written in clear, professional English.
- The company name is mentioned specifically.
- Return only valid JSON, no other text.
`;
}
