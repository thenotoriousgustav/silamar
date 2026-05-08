import type { Metadata } from "next";
import { getCoverLettersDTO } from "@/features/cover-letters-list/queries";
import { CoverLetterListClient } from "@/features/cover-letters-list/components/cover-letter-list-client";

export const metadata: Metadata = { title: "Cover Letters — SiLamar" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CoverLettersPage() {
  const coverLetters = await getCoverLettersDTO();

  return <CoverLetterListClient initialCoverLetters={coverLetters as any} />;
}
