import type { Metadata } from "next";
import { getResumesDTO } from "@/server/queries/resumes";
import { ResumeListClient } from "@/components/features/resumes/resume-list-client";

export const metadata: Metadata = { title: "Daftar Resume — SiLamar" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResumesPage() {
  const userResumes = await getResumesDTO();

  return <ResumeListClient initialResumes={userResumes} />;
}
