import { db } from "@/lib/db";
import { jobApplications } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await db.query.jobApplications.findMany({
      where: eq(jobApplications.userId, session.user.id),
      orderBy: [desc(jobApplications.createdAt)],
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("[JOBS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      company,
      position,
      status,
      type,
      jobUrl,
      salary,
      appliedDate,
      notes,
    } = body;

    if (!company || !position) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newJob = await db
      .insert(jobApplications)
      .values({
        id: uuidv4(),
        userId: session.user.id,
        company,
        position,
        status,
        type,
        jobUrl,
        salary,
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        notes,
      })
      .returning();

    return NextResponse.json(newJob[0]);
  } catch (error) {
    console.error("[JOBS_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 },
      );
    }

    // Convert string dates to Date objects if they exist
    const processedUpdates = { ...updates };
    if (processedUpdates.appliedDate) {
      processedUpdates.appliedDate = new Date(processedUpdates.appliedDate);
    }

    const updatedJob = await db
      .update(jobApplications)
      .set({
        ...processedUpdates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(jobApplications.id, id),
          eq(jobApplications.userId, session.user.id),
        ),
      )
      .returning();

    if (!updatedJob.length) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error("[JOBS_PATCH]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
