import { notFound } from "next/navigation";
import { getCoverLetterDTO } from "@/features/cover-letter-builder/queries";
import { CoverLetterBuilderData } from "@/features/cover-letters-list/schema";
import { CoverLetterBuilderClient } from "@/features/cover-letter-builder/components/cover-letter-builder-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CoverLetterBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let initialData = undefined;

  if (id !== "new") {
    const coverLetter = await getCoverLetterDTO(id);

    if (!coverLetter) notFound();

    initialData = {
      title: coverLetter.title,
      content: coverLetter.content as CoverLetterBuilderData,
      updatedAt: coverLetter.updatedAt,
    };
  }

  return <CoverLetterBuilderClient id={id} initialData={initialData} />;
}
