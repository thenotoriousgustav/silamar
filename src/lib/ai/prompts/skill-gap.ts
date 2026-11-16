import { z } from "zod";

export const skillGapSchema = z.object({
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(
    z.object({
      skill: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      howToLearn: z.string(),
    }),
  ),
  overallGapScore: z.number().min(0).max(100),
  learningPath: z.array(z.string()),
  estimatedTimeToReady: z.string(),
  verdict: z.string(),
});

export type SkillGapResult = z.infer<typeof skillGapSchema>;

export function buildSkillGapPrompt(
  userSkills: string[],
  jobTitle: string,
  jobDescription: string,
): string {
  return `
You are an expert career advisor helping job seekers identify skill gaps for their target career.

Analyze the skill gap between the skills the user currently has and the requirements of the desired position.

## User's Current Skills:
${userSkills.join(", ")}

## Target Position:
${jobTitle}

## Job Description / Requirements:
${jobDescription}

## Instructions:
Provide an actionable skill gap analysis in the following JSON format:

{
  "matchedSkills": [
    "<skill the user already has that is relevant to the position>"
  ],
  "missingSkills": [
    {
      "skill": "<name of the missing skill>",
      "priority": "high|medium|low",
      "howToLearn": "<how to learn this skill: specific platform, course, or resource>"
    }
  ],
  "overallGapScore": <0-100, higher means more ready>,
  "learningPath": [
    "<step 1 to take>",
    "<step 2>",
    "<step 3>",
    "<step 4>",
    "<step 5>"
  ],
  "estimatedTimeToReady": "<estimated time to be ready to apply for this position, e.g. '3-6 months'>",
  "verdict": "<brief conclusion and motivating summary in 2-3 sentences>"
}

Notes:
- Priority "high" = skill frequently mentioned in the JD or critical for the role
- Priority "medium" = helpful but not mandatory
- Priority "low" = nice to have
- Provide specific learning resources (e.g., "Python course on Coursera", "React Bootcamp on Udemy")

Return only valid JSON, no other text.
`;
}
