import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getResumeById,
  ResumeBuilderClient,
} from "@/features/resume-builder";
import type { ResumeContent } from "@/features/resume-builder";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Buat dan edit resume ATS-friendly dengan AI",
};

export default async function ResumeBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) notFound();

  const resume = await getResumeById(id, user.id);

  if (!resume) notFound();

  const initialData = {
    title: resume.title,
    content: resume.content as ResumeContent,
    updatedAt: resume.updatedAt,
  };

  return <ResumeBuilderClient id={id} initialData={initialData} />;
}
