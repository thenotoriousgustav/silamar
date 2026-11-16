import "server-only";

import { db } from "@/db";
import { coverLetters } from "@/db/schema";

export async function createCoverLetterQuery(
  userId: string,
): Promise<{ id: string }> {
  const rows = await db
    .insert(coverLetters)
    .values({
      id: crypto.randomUUID(),
      userId,
      title: "Cover Letter Tanpa Judul",
      content: {
        fullName: "",
        phone: "",
        email: "",
        address: "",
        cityAndPostal: "",
        recipientName: "",
        companyName: "",
        department: "",
        recipientAddress: "",
        recipientCityAndPostal: "",
        subject: "",
        content: "",
      },
      company: "",
      jobTitle: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: coverLetters.id });

  return { id: rows[0].id };
}
