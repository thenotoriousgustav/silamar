import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.any(), // ResumeContent type
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

    if (!resume) {
      return NextResponse.json(
        { error: "Resume tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("[API] resume get error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));

    if (!existing) {
      await db
        .insert(resumes)
        .values({
          id,
          userId: session.user.id,
          title: parsed.data.title ?? "Untitled Resume",
          content: parsed.data.content,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: resumes.id,
          set: {
            title: parsed.data.title,
            content: parsed.data.content,
            updatedAt: new Date(),
          },
        });
    } else {
      await db
        .update(resumes)
        .set({
          title: parsed.data.title,
          content: parsed.data.content,
          updatedAt: new Date(),
        })
        .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] resume patch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
