import type { Metadata } from "next";

import { ResumeRoastClient } from "@/features/resume-roast";
import { getSessionUser } from "@/lib/auth/session";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Mock Your Resume 🔥",
  description: "AI roasting tanpa ampun untuk resume kamu — for fun only!",
};

export default async function MockResumePage() {
  const user = await getSessionUser();
  if (!user) notFound();

  return <ResumeRoastClient />;
}
