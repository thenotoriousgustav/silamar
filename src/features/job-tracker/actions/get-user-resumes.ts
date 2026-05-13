"use server";

// eslint-disable-next-line import/no-restricted-paths -- Job tracker needs resume data for job applications
import { getResumesDTO } from "@/features/resumes-list/queries";

/**
 * Server action wrapper to fetch user resumes for the job form.
 * Delegates to the resumes-list feature query.
 */
export async function getUserResumes() {
  return await getResumesDTO();
}
