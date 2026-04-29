import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const runtime = "nodejs";

const ATSAnalysisSchema = z.object({
  score: z.number(),
  feedback: z.string(),
  criticalIssues: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  readabilityScore: z.number(),
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: ATSAnalysisSchema,
      prompt: `Analyze the following resume content for ATS (Applicant Tracking System) compatibility and overall quality.
      
      Resume Content:
      ${JSON.stringify(content)}
      
      Provide:
      1. An ATS score from 0-100.
      2. General feedback.
      3. List of critical issues (e.g., missing contact info, vague descriptions).
      4. Suggested keywords to add based on the profile.
      5. Readability score from 0-100.`,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("ATS Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
