import "server-only";

import { db } from "@/db";
import { resumes, jobApplications, jobTrackers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, desc, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * Get current session user, redirected to login if not found.
 * Memoized per request.
 */
export const getSessionUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return session.user;
});

/**
 * Data Access Layer for Resumes
 */

export const getResumesDTO = async () => {
  const user = await getSessionUser();
  if (!user) return [];

  const data = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, user.id))
    .orderBy(desc(resumes.updatedAt));

  if (data.length === 0) return [];

  // Fetch trackers for these resumes
  const resumeIds = data.map((r) => r.id);
  const appsWithTrackers = await db
    .select({
      resumeId: jobApplications.resumeId,
      trackerId: jobTrackers.id,
      trackerName: jobTrackers.name,
    })
    .from(jobApplications)
    .leftJoin(jobTrackers, eq(jobApplications.trackerId, jobTrackers.id))
    .where(
      and(
        eq(jobApplications.userId, user.id),
        inArray(jobApplications.resumeId, resumeIds),
      ),
    );

  return data.map((resume) => {
    const trackers = appsWithTrackers
      .filter((app) => app.resumeId === resume.id)
      .reduce(
        (acc, curr) => {
          // If it has a trackerId, use the tracker name
          if (curr.trackerId) {
            if (!acc.find((t) => t.id === curr.trackerId)) {
              acc.push({ id: curr.trackerId, name: curr.trackerName || "Unknown" });
            }
          } else {
            // If no trackerId, it belongs to the default "Job Tracker"
            if (!acc.find((t) => t.id === "default")) {
              acc.push({ id: "default", name: "Job Tracker" });
            }
          }
          return acc;
        },
        [] as { id: string; name: string }[],
      );

    return {
      ...resume,
      trackers,
    };
  });
};

export const getResumeDTO = async (id: string) => {
  const user = await getSessionUser();
  if (!user) return null;

  const data = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, id), eq(resumes.userId, user.id)),
  });

  if (!data) return null;

  return {
    ...data,
    content: data.content,
  };
};
