import type { Metadata } from "next";

import { getResumesDTO, ResumeListClient } from "@/features/resumes-list";

export const metadata: Metadata = {
  title: "Daftar Resume",
  description: "Lihat dan kelola semua resume yang telah kamu buat",
};

export default async function ResumesPage() {
  const userResumes = await getResumesDTO();

  return <ResumeListClient initialResumes={userResumes} />;
}
