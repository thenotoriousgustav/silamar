"use server";

import { getJobs } from "../queries/get-jobs";

/**
 * Server action wrapper for fetching jobs.
 * Used by client components via React Query.
 */
export async function getJobsAction(
  params: {
    trackerId?: string;
    position?: string;
    company?: string;
    type?: string | string[];
    status?: string | string[];
    from?: string | number;
    to?: string | number;
    sort?: string;
    page?: number;
    perPage?: number;
  } = {},
) {
  return await getJobs(params);
}
