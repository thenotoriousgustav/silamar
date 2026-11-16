"use client";

import { AlertTriangle } from "lucide-react";
import { useCallback, useState } from "react";

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

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

/**
 * Reusable confirmation dialog for deleting form section items.
 * Shows a warning before permanently removing an experience, education,
 * project, skill, or custom section item.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Hapus item ini?",
  description = "Data yang sudah diisi akan hilang dan tidak bisa dikembalikan.",
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <div className="bg-destructive/10 mb-2 flex h-10 w-10 items-center justify-center rounded-none">
            <AlertTriangle className="text-destructive h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-lg font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="bg-muted border-none">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
          >
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Hook that manages the confirm-before-delete flow.
 * Returns a trigger function and the dialog component props.
 *
 * Usage:
 * ```tsx
 * const { confirmDelete, dialogProps } = useConfirmDelete();
 *
 * <button onClick={() => confirmDelete(() => removeExperience(id))}>
 *   Delete
 * </button>
 * <ConfirmDeleteDialog {...dialogProps} />
 * ```
 */
export function useConfirmDelete() {
  const [open, setOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const confirmDelete = useCallback(
    (action: () => void, title?: string, description?: string) => {
      setPendingAction(() => action);
      setOpen(true);
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    pendingAction?.();
    setPendingAction(null);
  }, [pendingAction]);

  return {
    confirmDelete,
    dialogProps: {
      open,
      onOpenChange: setOpen,
      onConfirm: handleConfirm,
    },
  };
}
