import { getJobsDTO } from "@/data/jobs";
import { JobTrackerClient } from "@/app/(dashboard)/job-tracker/components/job-tracker-client";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobTrackerPage() {
  const userJobs = await getJobsDTO();
  const cookieStore = await cookies();
  const initialView =
    (cookieStore.get("silamar-job-tracker-view")?.value as
      | "kanban"
      | "table") || "table";

  return <JobTrackerClient initialJobs={userJobs} initialView={initialView} />;
}
