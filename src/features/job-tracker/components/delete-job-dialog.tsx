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
import type { JobApplication } from "@/features/job-tracker/types";

interface DeleteJobDialogProps {
  job: JobApplication | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteJobDialog({
  job,
  onOpenChange,
  onConfirm,
}: DeleteJobDialogProps) {
  return (
    <AlertDialog
      open={!!job}
      onOpenChange={(open) => !open && onOpenChange(false)}
    >
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Hapus Lamaran?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Lamaran kerja di{" "}
            <span className="text-foreground font-semibold">
              {job?.company}
            </span>{" "}
            sebagai{" "}
            <span className="text-foreground font-semibold">
              {job?.position}
            </span>{" "}
            akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none"
            onClick={() => job && onConfirm(job.id)}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
