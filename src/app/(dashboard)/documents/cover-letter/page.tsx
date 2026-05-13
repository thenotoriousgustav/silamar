import type { Metadata } from "next";

import {
  CoverLetterListClient,
  getCoverLettersDTO,
} from "@/features/cover-letters-list";

export const metadata: Metadata = {
  title: "Cover Letters",
  description: "Lihat dan kelola semua cover letter yang telah kamu buat",
};

export default async function CoverLettersPage() {
  const coverLetters = await getCoverLettersDTO();

  const mapped = coverLetters.map((cl) => ({
    id: cl.id,
    title: cl.title,
    jobTitle: cl.jobTitle ?? "",
    company: cl.company ?? "",
    content: typeof cl.content === "string" ? cl.content : "",
    updatedAt: cl.updatedAt,
  }));

  return <CoverLetterListClient initialCoverLetters={mapped} />;
}
