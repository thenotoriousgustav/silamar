import { notFound } from "next/navigation";
import { getResumeDTO } from "@/server/queries/resumes";
import { ResumeBuilderClient } from "../components/resume-builder-client";
import type { ResumeContent } from "@/types/resume";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResumeBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let initialData = undefined;

  if (id !== "new") {
    const resume = await getResumeDTO(id);

    if (!resume) notFound();

    initialData = {
      title: resume.title,
      content: resume.content as ResumeContent,
      updatedAt: resume.updatedAt,
    };
  }

  return <ResumeBuilderClient id={id} initialData={initialData} />;
}
