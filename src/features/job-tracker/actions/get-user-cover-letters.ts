"use server";

// eslint-disable-next-line import/no-restricted-paths -- Job tracker needs cover letter data for job applications
import { getCoverLettersDTO } from "@/features/cover-letters-list/queries";

/**
 * Server action wrapper to fetch user cover letters for the job form.
 * Delegates to the cover-letters-list feature query.
 */
export async function getUserCoverLetters() {
  return await getCoverLettersDTO();
}
