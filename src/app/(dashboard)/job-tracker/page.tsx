import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  COLUMN_ORDER_KEY,
  getJobsDTO,
  JobTrackerClient,
  VIEW_PREFERENCE_KEY,
} from "@/features/job-tracker";

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Lacak dan kelola semua lamaran kerja kamu di satu tempat",
};

export default async function JobTrackerPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const trackerId = searchParams.trackerId as string | undefined;

  const cookieStore = await cookies();

  const [userJobs, initialView, columnOrderCookie] = await Promise.all([
    getJobsDTO({ trackerId }),
    Promise.resolve(
      (cookieStore.get(VIEW_PREFERENCE_KEY)?.value as "kanban" | "table") ||
        "table",
    ),
    Promise.resolve(cookieStore.get(COLUMN_ORDER_KEY)?.value),
  ]);

  let initialColumnOrder: string[] | undefined;
  if (columnOrderCookie) {
    try {
      initialColumnOrder = JSON.parse(decodeURIComponent(columnOrderCookie));
    } catch {
      // Invalid cookie value, use default order
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
