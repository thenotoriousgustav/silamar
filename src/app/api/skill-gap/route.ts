import { randomUUID } from "crypto";

import { generateText, Output } from "ai";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { aiUsageLogs, users } from "@/db/schema";
import { defaultModel } from "@/lib/ai";
import {
  buildSkillGapPrompt,
  skillGapSchema,
} from "@/lib/ai/prompts/skill-gap";
import { auth } from "@/lib/auth";



const requestSchema = z.object({
  skills: z.array(z.string()).min(1, "Masukkan minimal 1 skill"),
  jobTitle: z.string().min(2),
  jobDescription: z.string().min(50),
});

/** Verifies user has credits and deducts one if not on Pro plan. */
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

    const prompt = buildSkillGapPrompt(
      parsed.data.skills,
      parsed.data.jobTitle,
      parsed.data.jobDescription,
    );

    const { output: result } = await generateText({
      model: defaultModel,
      output: Output.object({ schema: skillGapSchema }),
      prompt,
    });

    await db.insert(aiUsageLogs).values({
      id: randomUUID(),
      userId: session.user.id,
      featureType: "skill_gap",
      creditsUsed: isPro ? 0 : 1,
      inputData: { jobTitle: parsed.data.jobTitle },
      outputData: { overallGapScore: result.overallGapScore },
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("[API] skill-gap error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
