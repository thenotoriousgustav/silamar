import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, aiUsageLogs, coverLetters } from "@/lib/db/schema";
import { callAI } from "@/lib/ai/gemini";
import {
  buildCoverLetterPrompt,
  coverLetterSchema,
  type CoverLetterResult,
} from "@/lib/ai/prompts/cover-letter";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const requestSchema = z.object({
  resumeContent: z.string().min(50),
  jobTitle: z.string().min(2),
  company: z.string().min(2),
  jobDescription: z.string().optional(),
  tone: z.enum(["formal", "friendly", "professional"]).default("professional"),
  resumeId: z.string().optional(),
  saveLetter: z.boolean().default(false),
});

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

    const isPro = user.plan === "pro";
    if (!isPro && user.credits <= 0) {
      return NextResponse.json(
        { error: "Kredit tidak cukup. Beli kredit untuk melanjutkan." },
        { status: 402 },
      );
    }

    if (!isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.id, session.user.id));
    }

    const prompt = buildCoverLetterPrompt(
      parsed.data.resumeContent,
      parsed.data.jobTitle,
      parsed.data.company,
      parsed.data.jobDescription,
      parsed.data.tone,
    );
    const result = await callAI(prompt, coverLetterSchema);

    // Save cover letter if requested
    let coverLetterId: string | undefined;
    if (parsed.data.saveLetter) {
      coverLetterId = randomUUID();
      await db.insert(coverLetters).values({
        id: coverLetterId,
        userId: session.user.id,
        resumeId: parsed.data.resumeId ?? null,
        jobTitle: parsed.data.jobTitle,
        company: parsed.data.company,
        content: result.coverLetter,
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
