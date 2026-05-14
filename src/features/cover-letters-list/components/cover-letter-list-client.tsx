"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Mail, Plus } from "lucide-react";
import { useState } from "react";
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
import { deleteCoverLetterAction } from "@/features/cover-letters-list/actions";
import { DocumentCard } from "@/shared/document-card";
import { EmptyState } from "@/shared/empty-state";
import { PageHeader } from "@/shared/page-header";

import { CreateCoverLetterDialog } from "./create-cover-letter-dialog";
import { CoverLetterPreviewDrawer } from "./cover-letter-preview-drawer";

interface CoverLetter {
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  content: any;
  updatedAt: Date;
}

interface CoverLetterListClientProps {
  initialCoverLetters: CoverLetter[];
}

export function CoverLetterListClient({
  initialCoverLetters,
}: CoverLetterListClientProps) {
  const [coverLetterToDelete, setCoverLetterToDelete] = useState<string | null>(null);
  const [selectedLetterForPreview, setSelectedLetterForPreview] = useState<CoverLetter | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCoverLetterAction(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Cover letter berhasil dihapus");
        queryClient.invalidateQueries({ queryKey: ["cover-letters"] });
        setCoverLetterToDelete(null);
      } else {
        toast.error(result.error);
      }
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
      <PageHeader
        title="Cover Letters"
        description="Kelola surat lamaran yang telah kamu buat"
      >
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 hover:shadow-primary/30 text-primary-foreground flex items-center gap-2 px-4 py-5 text-sm font-semibold transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Buat Cover Letter Baru
        </Button>
      </PageHeader>

      {initialCoverLetters.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-8 w-8" />}
          title="Belum ada cover letter"
          description="Gunakan AI Generator kami untuk membuat surat lamaran yang profesional dalam hitungan detik."
          action={
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-6 py-3 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              Buat Cover Letter Pertama
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialCoverLetters.map((letter) => (
            <DocumentCard
              key={letter.id}
              title={letter.title}
              subtitle={
                letter.jobTitle
                  ? `${letter.jobTitle} @ ${letter.company}`
                  : letter.company
              }
              updatedAt={letter.updatedAt}
              icon={<Mail className="text-primary h-6 w-6" />}
              onDelete={() => setCoverLetterToDelete(letter.id)}
              onClick={() => {
                setSelectedLetterForPreview(letter);
                setIsPreviewOpen(true);
              }}
              href={`/cover-letter-builder/${letter.id}`}
              linkText="Edit Detail"
            />
          ))}

          {/* New cover letter card */}
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="hover:border-primary/30 hover:bg-muted/50 border-border flex flex-col items-center justify-center rounded-none border border-dashed p-6 text-center transition-all"
          >
            <div className="border-border mb-3 flex h-12 w-12 items-center justify-center border border-dashed">
              <Plus className="text-muted-foreground h-5 w-5" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Buat Cover Letter Baru
            </span>
          </button>
        </div>
      )}

      <CreateCoverLetterDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <CoverLetterPreviewDrawer
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        coverLetter={selectedLetterForPreview}
      />

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
