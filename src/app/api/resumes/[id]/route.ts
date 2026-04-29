import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const resume = await db.query.resumes.findFirst({
      where: and(eq(resumes.id, id), eq(resumes.userId, session.user.id)),
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("[RESUME_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updatedResume = await db
      .update(resumes)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
      .returning();

    // If no resume was updated, it might be a new one being imported with a generated ID
    if (!updatedResume.length) {
      const newResume = await db
        .insert(resumes)
        .values({
          id,
          userId: session.user.id,
          title: body.title || "Resume Saya",
          content: body.content || {},
          atsScore: body.atsScore || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json({ resume: newResume[0] });
    }

    return NextResponse.json({ resume: updatedResume[0] });
  } catch (error) {
    console.error("[RESUME_PATCH]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 },
      );
    }

    const deletedResume = await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
      .returning();

    if (!deletedResume.length) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("[RESUME_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
