"use server";

import { db } from "@/db";
import { jobApplications, jobTrackers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { getJobsDTO, getTrackersDTO } from "@/features/job-tracker/queries";
import { getResumesDTO } from "@/features/resumes/queries";

/**
 * Server Actions for Job Tracker
 */

export async function getUserResumesAction() {
  return await getResumesDTO();
}

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function getJobsAction(params: any = {}) {
  return await getJobsDTO(params);
}

export async function getTrackersAction() {
  return await getTrackersDTO();
}

export async function createTrackerAction(data: {
  name: string;
  description?: string;
}) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const newTracker = await db
    .insert(jobTrackers)
    .values({
      id: uuidv4(),
      userId: session.user.id,
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/dashboard", "layout");
  return newTracker[0];
}

export async function updateTrackerAction(
  id: string,
  data: {
    name?: string;
    description?: string;
  },
) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const updated = await db
    .update(jobTrackers)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(eq(jobTrackers.id, id), eq(jobTrackers.userId, session.user.id)),
    )
    .returning();

  revalidatePath("/dashboard", "layout");
  return updated[0];
}

export async function deleteTrackerAction(id: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const deleted = await db
    .delete(jobTrackers)
    .where(
      and(eq(jobTrackers.id, id), eq(jobTrackers.userId, session.user.id)),
    )
    .returning();

  revalidatePath("/dashboard", "layout");
  return deleted[0];
}

export async function createJobAction(data: any) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const { appliedDate, interviewDate, offerDate, ...rest } = data;

  const newJob = await db
    .insert(jobApplications)
    .values({
      id: uuidv4(),
      userId: session.user.id,
      ...rest,
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      offerDate: offerDate ? new Date(offerDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  revalidatePath("/job-tracker");
  return newJob[0];
}

export async function updateJobAction(id: string, data: any) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const { appliedDate, interviewDate, offerDate, ...updates } = data;

  const processedUpdates = { ...updates };
  if (appliedDate) processedUpdates.appliedDate = new Date(appliedDate);
  if (interviewDate) processedUpdates.interviewDate = new Date(interviewDate);
  if (offerDate) processedUpdates.offerDate = new Date(offerDate);

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

  if (!updatedJob.length) throw new Error("Job not found or unauthorized");

  revalidatePath("/job-tracker");
  return updatedJob[0];
}

export async function deleteJobAction(id: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const deletedJob = await db
    .delete(jobApplications)
    .where(
      and(
        eq(jobApplications.id, id),
        eq(jobApplications.userId, session.user.id),
      ),
    )
    .returning();

  if (!deletedJob.length) throw new Error("Job not found or unauthorized");

  revalidatePath("/job-tracker");
  return { success: true };
}
