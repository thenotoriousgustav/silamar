import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ResumeListClient } from "@/components/dashboard/resume-builder/resume-list-client";

export const metadata: Metadata = { title: "Resume Builder" };

export default async function ResumeBuilderPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const userResumes = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, session.user.id))
    .orderBy(desc(resumes.updatedAt));

  return <ResumeListClient initialResumes={userResumes} />;
}
