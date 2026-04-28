import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, aiUsageLogs } from "@/lib/db/schema";
import { callAI } from "@/lib/ai/gemini";
import {
  buildResumeAnalyzeJdPrompt,
  resumeAnalyzeJdSchema,
  type ResumeAnalyzeJdResult,
} from "@/lib/ai/prompts/resume-analyze-jd";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const requestSchema = z.object({
  resumeContent: z.string().min(50, "Resume terlalu pendek"),
  jobDescription: z.string().min(50, "Deskripsi kerja terlalu pendek"),
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
        { status: 400 }
      );
    }

    const [user] = await db
      .select({ credits: users.credits, plan: users.plan })
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const isPro = user.plan === "pro";
    if (!isPro && user.credits <= 0) {
      return NextResponse.json(
        { error: "Kredit tidak cukup. Beli kredit untuk melanjutkan." },
        { status: 402 }
      );
    }

    if (!isPro) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} - 1` })
        .where(eq(users.id, session.user.id));
    }

    const prompt = buildResumeAnalyzeJdPrompt(
      parsed.data.resumeContent,
      parsed.data.jobDescription
    );
    const result = await callAI(prompt, resumeAnalyzeJdSchema);

    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: session.user.id,
      featureType: "resume_analyze_jd",
      creditsUsed: isPro ? 0 : 1,
      inputData: {},
      outputData: { matchScore: result.matchScore },
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("[API] resume/analyze-jd error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
