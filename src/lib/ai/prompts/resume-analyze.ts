import { z } from "zod";

export const resumeAnalyzeSchema = z.object({
  atsScore: z.number().min(0).max(100),
  overallFeedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  keywordSuggestions: z.array(z.string()),
  sectionScores: z.object({
    contact: z.number().min(0).max(100),
    summary: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
  }),
});

export type ResumeAnalyzeResult = z.infer<typeof resumeAnalyzeSchema>;

export function buildResumeAnalyzePrompt(resumeContent: string): string {
  return `
You are an AI expert in resume analysis who has helped thousands of job seekers land their dream jobs.

Analyze the following resume and provide a comprehensive ATS (Applicant Tracking System) evaluation.

## Resume to Analyze:
${resumeContent}

## Instructions:
Provide a detailed analysis in the following JSON format:

{
  "atsScore": <number 0-100 based on overall ATS quality>,
  "overallFeedback": "<general feedback in 2-3 sentences about this resume>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "improvements": [
    "<improvement suggestion 1>",
    "<improvement suggestion 2>",
    "<improvement suggestion 3>"
  ],
  "keywordSuggestions": [
    "<suggested ATS keyword 1>",
    "<suggested ATS keyword 2>",
    "<suggested ATS keyword 3>",
    "<suggested ATS keyword 4>",
    "<suggested ATS keyword 5>"
  ],
  "sectionScores": {
    "contact": <0-100>,
    "summary": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>
  }
}

ATS scoring factors:
- Clean format that is easy for machines to read
- Use of relevant keywords
- Complete contact information
- Quantitative experience descriptions (numbers, percentages)
- Logical ordering of information
- No images, tables, or elements that are difficult for ATS to parse

Return only valid JSON, no other text.
`;
}
