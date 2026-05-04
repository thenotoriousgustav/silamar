import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, aiUsageLogs } from "@/db/schema";
import { callAI } from "@/lib/ai/gemini";
import {
  buildSkillGapPrompt,
  skillGapSchema,
  type SkillGapResult,
} from "@/lib/ai/prompts/skill-gap";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const requestSchema = z.object({
  skills: z.array(z.string()).min(1, "Masukkan minimal 1 skill"),
  jobTitle: z.string().min(2),
  jobDescription: z.string().min(50),
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

    const prompt = buildSkillGapPrompt(
      parsed.data.skills,
      parsed.data.jobTitle,
      parsed.data.jobDescription
    );
    const result = await callAI(prompt, skillGapSchema);

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
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
