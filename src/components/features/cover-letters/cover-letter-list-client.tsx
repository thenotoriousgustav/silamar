"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  ArrowRight,
  Loader2,
  Trash2,
  AlertTriangle,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { deleteCoverLetterAction } from "@/server/actions/documents/cover-letters";

interface CoverLetter {
  id: string;
  jobTitle: string;
  company: string;
  updatedAt: Date;
  content: string;
}

interface CoverLetterListClientProps {
  initialCoverLetters: CoverLetter[];
}

export function CoverLetterListClient({
  initialCoverLetters,
}: CoverLetterListClientProps) {
  const [coverLetterToDelete, setCoverLetterToDelete] = useState<string | null>(
    null,
  );
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCoverLetterAction(id),
    onSuccess: () => {
      toast.success("Cover letter berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["cover-letters"] });
      setCoverLetterToDelete(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Terjadi kesalahan saat menghapus cover letter");
    },
  });

  const handleDelete = () => {
    if (coverLetterToDelete) {
      deleteMutation.mutate(coverLetterToDelete);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Cover Letters</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola surat lamaran yang telah kamu buat
          </p>
        </div>
        <Link href="/documents/cover-letter/create">
          <Button className="bg-primary hover:bg-primary/90 hover:shadow-primary/30 text-primary-foreground flex items-center gap-2 px-4 py-5 text-sm font-semibold transition-all hover:shadow-md">
            <Plus className="h-4 w-4" />
            Buat Cover Letter Baru
          </Button>
        </Link>
      </div>

      {initialCoverLetters.length === 0 ? (
        <div className="border-border flex flex-col items-center justify-center border border-dashed py-20 text-center">
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-none">
            <Mail className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">
            Belum ada cover letter
          </h3>
          <p className="text-muted-foreground mt-2 max-w-xs text-sm">
            Gunakan AI Generator kami untuk membuat surat lamaran yang
            profesional dalam hitungan detik.
          </p>
          <Link href="/documents/cover-letter/create" className="mt-6">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-6 py-3 text-sm font-semibold">
              <Plus className="h-4 w-4" />
              Buat Cover Letter Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialCoverLetters.map((letter) => (
            <div
              key={letter.id}
              className="glass group hover:border-primary/30 hover:shadow-primary/10 flex flex-col p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-primary/20 flex h-12 w-12 items-center justify-center">
                  <Mail className="text-primary h-6 w-6" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-destructive hover:bg-destructive/10 text-muted-foreground -mt-2 -mr-2 h-8 w-8 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setCoverLetterToDelete(letter.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="group-hover:text-primary text-foreground truncate font-semibold transition-colors">
                {letter.jobTitle}
              </h3>
              <p className="text-muted-foreground truncate text-sm">
                {letter.company}
              </p>
              <p className="text-muted-foreground mt-4 text-xs">
                Diupdate {formatDate(letter.updatedAt)}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4">
                <Link
                  href={`/documents/cover-letter/${letter.id}`}
                  className="text-muted-foreground group-hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                >
                  Lihat Detail <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}

          {/* New cover letter card */}
          <Link
            href="/documents/cover-letter/create"
            className="hover:border-primary/30 hover:bg-muted/50 border-border flex flex-col items-center justify-center rounded-none border border-dashed p-6 text-center transition-all"
          >
            <div className="border-border mb-3 flex h-12 w-12 items-center justify-center border border-dashed">
              <Plus className="text-muted-foreground h-5 w-5" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Buat Cover Letter Baru
            </span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!coverLetterToDelete}
        onOpenChange={(open) => !open && setCoverLetterToDelete(null)}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <div className="bg-destructive/10 mb-2 flex h-12 w-12 items-center justify-center rounded-none">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Cover Letter?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Surat lamaran kamu akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="bg-muted border-none">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
