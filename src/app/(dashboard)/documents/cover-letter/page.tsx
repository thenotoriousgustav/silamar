import type { Metadata } from "next";
import { getCoverLettersDTO } from "@/server/queries/cover-letters";
import { CoverLetterListClient } from "@/components/features/cover-letters/cover-letter-list-client";

export const metadata: Metadata = { title: "Cover Letters — SiLamar" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CoverLettersPage() {
  const coverLetters = await getCoverLettersDTO();

  return <CoverLetterListClient initialCoverLetters={coverLetters as any} />;
}
