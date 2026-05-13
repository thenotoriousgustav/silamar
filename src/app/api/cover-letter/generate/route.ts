import { randomUUID } from "crypto";

import { generateText, Output } from "ai";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { aiUsageLogs, coverLetters, users } from "@/db/schema";
import { defaultModel } from "@/lib/ai";
import {
  buildCoverLetterPrompt,
  coverLetterSchema,
} from "@/lib/ai/prompts/cover-letter";
import { auth } from "@/lib/auth";



const requestSchema = z.object({
  resumeContent: z.string().min(50),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  jobDescription: z.string().nullable().optional(),
  tone: z.enum(["formal", "friendly", "professional"]).default("professional"),
  resumeId: z.string().nullable().optional(),
  saveLetter: z.boolean().default(false),
});

/** Verifies user has credits and deducts one if not on Pro plan. Returns null on success, or error response. */
async function verifyAndDeductCredit(userId: string): Promise<{
  isPro: boolean;
  error?: NextResponse;
}> {
  const [user] = await db
    .select({ credits: users.credits, plan: users.plan })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return {
      isPro: false,
      error: NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      ),
    };
  }

  const isPro = user.plan === "pro";
  if (!isPro && user.credits <= 0) {
    return {
      isPro,
      error: NextResponse.json(
        { error: "Kredit tidak cukup. Beli kredit untuk melanjutkan." },
        { status: 402 },
      ),
    };
  }

  if (!isPro) {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1` })
      .where(eq(users.id, userId));
  }

  return { isPro };
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
        { error: "Input tidak valid", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { isPro, error } = await verifyAndDeductCredit(session.user.id);
    if (error) return error;

    const prompt = buildCoverLetterPrompt({
      resumeContent: parsed.data.resumeContent,
      jobTitle: parsed.data.jobTitle,
      company: parsed.data.company,
      jobDescription: parsed.data.jobDescription ?? undefined,
      tone: parsed.data.tone,
    });

    const { output: result } = await generateText({
      model: defaultModel,
      output: Output.object({ schema: coverLetterSchema }),
      prompt,
    });

    let coverLetterId: string | undefined;
    if (parsed.data.saveLetter) {
      coverLetterId = randomUUID();
      await db.insert(coverLetters).values({
        id: coverLetterId,
        userId: session.user.id,
        resumeId: parsed.data.resumeId ?? null,
        jobTitle: parsed.data.jobTitle,
        company: parsed.data.company,
        content: result,
      });
    }

    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: session.user.id,
      featureType: "cover_letter",
      creditsUsed: isPro ? 0 : 1,
      inputData: {
        jobTitle: parsed.data.jobTitle,
        company: parsed.data.company,
      },
      outputData: {},
    });

    return NextResponse.json(
      { success: true, data: result, coverLetterId },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API] cover-letter/generate error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
