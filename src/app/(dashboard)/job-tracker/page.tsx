import { getJobsDTO } from "@/server/queries/job-applications";
import { JobTrackerClient } from "@/app/(dashboard)/job-tracker/components/job-tracker-client";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { VIEW_PREFERENCE_KEY, COLUMN_ORDER_KEY } from "./constants";

export default async function JobTrackerPage() {
  const userJobs = await getJobsDTO();
  const cookieStore = await cookies();
  
  const initialView =
    (cookieStore.get(VIEW_PREFERENCE_KEY)?.value as
      | "kanban"
      | "table") || "table";

  const columnOrderCookie = cookieStore.get(COLUMN_ORDER_KEY)?.value;
  let initialColumnOrder: string[] | undefined;
  
  if (columnOrderCookie) {
    try {
      initialColumnOrder = JSON.parse(decodeURIComponent(columnOrderCookie));
    } catch (e) {
      console.error("Failed to parse initial column order", e);
    }
  }

  return (
    <JobTrackerClient 
      initialJobs={userJobs} 
      initialView={initialView} 
      initialColumnOrder={initialColumnOrder}
    />
  );
}
