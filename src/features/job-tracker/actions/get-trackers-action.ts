"use server";

import { getTrackers } from "../queries/get-trackers";

/**
 * Server action wrapper for fetching trackers.
 * Used by client components via React Query.
 */
export async function getTrackersAction() {
  return await getTrackers();
}
