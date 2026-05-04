import type { Metadata } from "next";
import { getResumesDTO } from "@/server/queries/resumes";
import { ResumeListClient } from "./components/resume-list-client";

export const metadata: Metadata = { title: "Resume Builder" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResumeBuilderPage() {
  const userResumes = await getResumesDTO();

  return <ResumeListClient initialResumes={userResumes} />;
}
