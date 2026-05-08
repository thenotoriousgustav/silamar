import { notFound } from "next/navigation";
import { getResumeDTO } from "@/features/resume-builder/queries";
import { ResumeBuilderClient } from "@/features/resume-builder/components/resume-builder-client";
import type { ResumeContent } from "@/features/resumes-list/types/resume";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResumeBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const resume = await getResumeDTO(id);

  if (!resume) notFound();

  const initialData = {
    title: resume.title,
    content: resume.content as ResumeContent,
    updatedAt: resume.updatedAt,
  };

  return <ResumeBuilderClient id={id} initialData={initialData} />;
}
