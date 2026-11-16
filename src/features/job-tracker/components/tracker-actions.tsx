"use client";

import { DotsThree, PencilSimple, Trash } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import {
  deleteTrackerAction,
  updateTrackerAction,
} from "@/features/job-tracker/actions";

interface TrackerActionsProps {
  tracker: {
    id: string;
    name: string;
    description?: string | null;
  };
}

export function TrackerActions({ tracker }: TrackerActionsProps) {
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(tracker.name);

  const deleteMutation = useMutation({
    mutationFn: () => deleteTrackerAction(tracker.id),
    onSuccess: () => {
      toast.success("Tracker berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["trackers"] });
    },
    onError: () => {
      toast.error("Gagal menghapus tracker");
    },
  });

  const renameMutation = useMutation({
    mutationFn: () => updateTrackerAction(tracker.id, { name: newName }),
    onSuccess: () => {
      toast.success("Tracker berhasil diubah");
      queryClient.invalidateQueries({ queryKey: ["trackers"] });
      setIsRenameOpen(false);
    },
    onError: () => {
      toast.error("Gagal mengubah tracker");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <DotsThree weight="bold" />
            <span className="sr-only">Aksi</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
            <PencilSimple className="mr-2 h-4 w-4" />
            <span>Ganti Nama</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Hapus</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ganti Nama Tracker</DialogTitle>
            <DialogDescription>Ubah nama untuk tracker ini.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="rename-tracker">Nama Baru</FieldLabel>
              <Input
                id="rename-tracker"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => renameMutation.mutate()}
              disabled={renameMutation.isPending}
            >
              {renameMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tracker?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data lamaran di dalam
              tracker <span className="font-bold">{tracker.name}</span> juga
              akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
