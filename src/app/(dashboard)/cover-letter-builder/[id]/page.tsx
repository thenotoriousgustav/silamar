import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CoverLetterBuilderClient,
  getCoverLetterById,
} from "@/features/cover-letter-builder";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Cover Letter Builder",
  description: "Buat cover letter profesional yang disesuaikan dengan lowongan",
};

export default async function CoverLetterBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) notFound();

  const coverLetter = await getCoverLetterById(id);
  if (!coverLetter) notFound();

  const initialData = {
    title: coverLetter.title,
    content: coverLetter.content,
    updatedAt: coverLetter.updatedAt,
  };

  return <CoverLetterBuilderClient id={id} initialData={initialData} />;
}
