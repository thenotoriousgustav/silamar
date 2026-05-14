import { z } from "zod";

export const resumeAnalyzeJdSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
  verdict: z.string(),
});

export type ResumeAnalyzeJdResult = z.infer<typeof resumeAnalyzeJdSchema>;

export function buildResumeAnalyzeJdPrompt(
  resumeContent: string,
  jobDescription: string,
): string {
  return `
You are an AI expert in matching resumes to job descriptions to help job seekers land their target roles.

Analyze the match between the resume and the job description below.

## Resume:
${resumeContent}

## Job Description:
${jobDescription}

## Instructions:
Analyze the match and return the result in the following JSON format:

{
  "matchScore": <number 0-100 indicating the match percentage>,
  "matchedKeywords": [
    "<keyword present in both the resume and the JD>",
    "<matched keyword>"
  ],
  "missingKeywords": [
    "<important keyword in the JD that is NOT in the resume>",
    "<missing keyword>"
  ],
  "suggestions": [
    "<specific suggestion to improve the match>",
    "<suggestion 2>",
    "<suggestion 3>"
  ],
  "verdict": "<2-3 sentence conclusion on whether the resume is a good fit and what should be done>"
}

Match score guide:
- 80-100: Excellent match, highly recommended to apply
- 60-79: Good match, a few adjustments needed
- 40-59: Partial match, significant improvements required
- 0-39: Poor match, consider other positions

Return only valid JSON, no other text.
`;
}
