import { z } from "zod";

export const mockInterviewResultSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      category: z.enum(["behavioral", "technical", "situational", "hr"]),
      question: z.string(),
      tips: z.string(),
      sampleAnswer: z.string(),
    }),
  ),
  interviewTips: z.array(z.string()),
  commonMistakes: z.array(z.string()),
});

export type MockInterviewResult = z.infer<typeof mockInterviewResultSchema>;

export const mockInterviewFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  improvedAnswer: z.string(),
  overallFeedback: z.string(),
});

export type MockInterviewFeedbackResult = z.infer<
  typeof mockInterviewFeedbackSchema
>;

type MockInterviewQuestionsParams = {
  jobTitle: string;
  company: string;
  resumeContent: string;
  jobDescription?: string;
};

export function buildMockInterviewQuestionsPrompt(
  params: MockInterviewQuestionsParams,
): string {
  const { jobTitle, company, resumeContent, jobDescription } = params;
  return `
You are an experienced interviewer from a top company helping job seekers prepare for interviews.

Generate 8-10 relevant and realistic interview questions.

## Position Applied For:
- Job Title: ${jobTitle}
- Company: ${company}
${jobDescription ? `- Job Description: ${jobDescription}` : ""}

## Applicant's Resume:
${resumeContent}

## Instructions:
Generate interview questions in the following JSON format:

{
  "questions": [
    {
      "id": "q1",
      "category": "behavioral|technical|situational|hr",
      "question": "<specific and relevant interview question>",
      "tips": "<brief tips on how to answer this question>",
      "sampleAnswer": "<example of a good answer in 2-3 sentences>"
    }
  ],
  "interviewTips": [
    "<general tip for interviewing at this company/industry>",
    "<tip 2>",
    "<tip 3>"
  ],
  "commonMistakes": [
    "<common mistake to avoid>",
    "<mistake 2>",
    "<mistake 3>"
  ]
}

Question distribution:
- 2-3 behavioral questions (past experience)
- 2-3 technical questions (relevant technical skills)
- 2 situational questions (how would you handle situation X)
- 1-2 HR questions (motivation, salary, career goals)

Make questions specific based on the resume and position, not generic questions.

Return only valid JSON, no other text.
`;
}

export function buildMockInterviewFeedbackPrompt(
  question: string,
  userAnswer: string,
  jobTitle: string,
): string {
  return `
You are an experienced interviewer providing constructive feedback to a job candidate.

## Interview Question:
${question}

## Position Applied For:
${jobTitle}

## Candidate's Answer:
${userAnswer}

## Instructions:
Provide constructive and actionable feedback in the following JSON format:

{
  "score": <0-100 quality score for the answer>,
  "strengths": [
    "<what was good about this answer>"
  ],
  "improvements": [
    "<what could be improved>"
  ],
  "improvedAnswer": "<example of a better and more complete answer>",
  "overallFeedback": "<overall motivating feedback in 2 sentences>"
}

Scoring guide:
- 90-100: Perfect answer, specific and convincing
- 70-89: Good answer, a few areas could be strengthened
- 50-69: Adequate, but needs to be more specific and structured
- 0-49: Needs significant improvement

Use the STAR method (Situation, Task, Action, Result) as a reference.

Return only valid JSON, no other text.
`;
}
