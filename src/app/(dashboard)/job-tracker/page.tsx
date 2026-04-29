import { getJobsDTO } from "@/data/jobs";
import { JobTrackerClient } from "@/app/(dashboard)/job-tracker/components/job-tracker-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobTrackerPage() {
  const userJobs = await getJobsDTO();

  return <JobTrackerClient initialJobs={userJobs as any} />;
}
