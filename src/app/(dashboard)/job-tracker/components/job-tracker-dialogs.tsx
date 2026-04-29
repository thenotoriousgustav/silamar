"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { JobFormDrawer } from "@/app/(dashboard)/job-tracker/components/job-form-drawer";
import type { JobApplication } from "@/types/job";

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
}: JobTrackerDialogsProps) {
  return (
    <>
      <JobFormDrawer
        job={null}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={onAddSuccess}
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

      <AlertDialog
        open={!!jobToDelete}
        onOpenChange={(open) => !open && setJobToDelete(null)}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Lamaran?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Lamaran kerja di{" "}
              <span className="text-foreground font-semibold">
                {jobToDelete?.company}
              </span>{" "}
              sebagai{" "}
              <span className="text-foreground font-semibold">
                {jobToDelete?.position}
              </span>{" "}
              akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none"
              onClick={() => jobToDelete && onConfirmDelete(jobToDelete.id)}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
