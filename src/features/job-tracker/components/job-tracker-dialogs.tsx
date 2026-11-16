"use client";

import type { JobApplication } from "@/features/job-tracker/types";

import { DeleteJobDialog } from "./delete-job-dialog";
import { JobFormDrawer } from "./job-form-drawer";

interface JobTrackerDialogsProps {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  selectedJob: JobApplication | null;
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  jobToDelete: JobApplication | null;
  setJobToDelete: (job: JobApplication | null) => void;
  onAddSuccess: () => void;
  onDetailSuccess: () => void;
  onConfirmDelete: (id: string) => void;
  trackerId?: string | null;
}

export function JobTrackerDialogs({
  isAddOpen,
  setIsAddOpen,
  selectedJob,
  isDetailOpen,
  setIsDetailOpen,
  jobToDelete,
  setJobToDelete,
  onAddSuccess,
  onDetailSuccess,
  onConfirmDelete,
  trackerId,
}: JobTrackerDialogsProps) {
  return (
    <>
      <JobFormDrawer
        job={null}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={onAddSuccess}
        trackerId={trackerId}
      />

      <JobFormDrawer
        job={selectedJob}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSuccess={onDetailSuccess}
        onDelete={(job) => {
          setIsDetailOpen(false);
          setJobToDelete(job);
        }}
      />

      <DeleteJobDialog
        job={jobToDelete}
        onOpenChange={() => setJobToDelete(null)}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
