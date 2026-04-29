import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobApplications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { JobTrackerClient } from "@/app/(dashboard)/job-tracker/components/job-tracker-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobTrackerPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const userJobs = await db
    .select()
    .from(jobApplications)
    .where(eq(jobApplications.userId, session.user.id))
    .orderBy(desc(jobApplications.updatedAt));

  return <JobTrackerClient initialJobs={userJobs} />;
}
