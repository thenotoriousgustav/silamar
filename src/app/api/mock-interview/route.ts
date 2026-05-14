import { randomUUID } from "crypto";

import { generateText, Output } from "ai";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { aiUsageLogs, users } from "@/db/schema";
import { defaultModel } from "@/lib/ai";
import {
  buildMockInterviewFeedbackPrompt,
  buildMockInterviewQuestionsPrompt,
  type MockInterviewFeedbackResult,
  mockInterviewFeedbackSchema,
  type MockInterviewResult,
  mockInterviewResultSchema,
} from "@/lib/ai/prompts/mock-interview";
import { auth } from "@/lib/auth";



const generateSchema = z.object({
  action: z.literal("generate"),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  resumeContent: z.string().min(50),
  jobDescription: z.string().optional(),
});

const feedbackSchema = z.object({
  action: z.literal("feedback"),
  question: z.string().min(5),
  userAnswer: z.string().min(10),
  jobTitle: z.string().min(2),
});

const requestSchema = z.discriminatedUnion("action", [
  generateSchema,
  feedbackSchema,
]);

/** Verifies user has credits and deducts one if not on Pro plan. */
async function verifyAndDeductCredit(
  userId: string,
  shouldDeduct: boolean,
): Promise<{ isPro: boolean; error?: NextResponse }> {
  const [user] = await db
    .select({ credits: users.credits, plan: users.plan })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return {
      isPro: false,
      error: NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      ),
    };
  }

  const isPro = user.plan === "pro";
  if (shouldDeduct && !isPro && user.credits <= 0) {
    return {
      isPro,
      error: NextResponse.json(
        { error: "Insufficient credits. Purchase credits to continue." },
        { status: 402 },
      ),
    };
  }

  if (shouldDeduct && !isPro) {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1` })
      .where(eq(users.id, userId));
  }

  return { isPro };
}

/** Generates interview questions using AI. */
async function handleGenerateQuestions(
  data: z.infer<typeof generateSchema>,
): Promise<MockInterviewResult> {
  const prompt = buildMockInterviewQuestionsPrompt({
    jobTitle: data.jobTitle,
    company: data.company,
    resumeContent: data.resumeContent,
    jobDescription: data.jobDescription,
  });

  const { output } = await generateText({
    model: defaultModel,
    output: Output.object({ schema: mockInterviewResultSchema }),
    prompt,
  });
  return output;
}

/** Generates feedback for a user's interview answer using AI. */
async function handleFeedback(
  data: z.infer<typeof feedbackSchema>,
): Promise<MockInterviewFeedbackResult> {
  const prompt = buildMockInterviewFeedbackPrompt(
    data.question,
    data.userAnswer,
    data.jobTitle,
  );

  const { output } = await generateText({
    model: defaultModel,
    output: Output.object({ schema: mockInterviewFeedbackSchema }),
    prompt,
  });
  return output;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const costCredit = parsed.data.action === "generate";
    const { isPro, error } = await verifyAndDeductCredit(
      session.user.id,
      costCredit,
    );
    if (error) return error;

    let result: MockInterviewResult | MockInterviewFeedbackResult;

    if (parsed.data.action === "generate") {
      result = await handleGenerateQuestions(parsed.data);

      await db.insert(aiUsageLogs).values({
        id: randomUUID(),
        userId: session.user.id,
        featureType: "mock_interview",
        creditsUsed: isPro ? 0 : 1,
        inputData: { jobTitle: parsed.data.jobTitle, action: "generate" },
        outputData: {},
      });
    } else {
      result = await handleFeedback(parsed.data);
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("[API] mock-interview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
