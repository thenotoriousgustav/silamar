import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, aiUsageLogs } from "@/db/schema";
import { generateText, Output } from "ai";
import { defaultModel } from "@/lib/ai";
import {
  buildMockInterviewQuestionsPrompt,
  buildMockInterviewFeedbackPrompt,
  mockInterviewResultSchema,
  mockInterviewFeedbackSchema,
  type MockInterviewResult,
  type MockInterviewFeedbackResult,
} from "@/lib/ai/prompts/mock-interview";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

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
        { error: "Input tidak valid", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const [user] = await db
      .select({ credits: users.credits, plan: users.plan })
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Feedback doesn't cost credit; only generating questions does
    const costCredit = parsed.data.action === "generate";
    const isPro = user.plan === "pro";

    if (costCredit && !isPro && user.credits <= 0) {
      return NextResponse.json(
        { error: "Kredit tidak cukup. Beli kredit untuk melanjutkan." },
        { status: 402 },
      );
    }

    if (costCredit && !isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.id, session.user.id));
    }

    let result: MockInterviewResult | MockInterviewFeedbackResult;

    if (parsed.data.action === "generate") {
      const prompt = buildMockInterviewQuestionsPrompt(
        parsed.data.jobTitle,
        parsed.data.company,
        parsed.data.resumeContent,
        parsed.data.jobDescription,
      );
      
      const { output } = await generateText({
        model: defaultModel,
        output: Output.object({
          schema: mockInterviewResultSchema,
        }),
        prompt,
      });
      result = output;

      await db.insert(aiUsageLogs).values({
        id: randomUUID(),
        userId: session.user.id,
        featureType: "mock_interview",
        creditsUsed: isPro ? 0 : 1,
        inputData: { jobTitle: parsed.data.jobTitle, action: "generate" },
        outputData: {},
      });
    } else {
      const prompt = buildMockInterviewFeedbackPrompt(
        parsed.data.question,
        parsed.data.userAnswer,
        parsed.data.jobTitle,
      );
      
      const { output } = await generateText({
        model: defaultModel,
        output: Output.object({
          schema: mockInterviewFeedbackSchema,
        }),
        prompt,
      });
      result = output;
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("[API] mock-interview error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
