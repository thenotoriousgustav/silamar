"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  ArrowRight,
  Sparkles,
  PencilLine,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ResumeContent } from "@/types/resume";
import { calculateCompleteness } from "@/lib/resume/completeness";
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
import { deleteResumeAction, createResumeAction, getResumesAction } from "../server";
import { ResumeImportDialog } from "./resume-import-dialog";

interface Resume {
  id: string;
  title: string;
  updatedAt: Date;
  atsScore: number | null;
  content: any; // Add content to calculate completeness
}

interface ResumeListClientProps {
  initialResumes: Resume[];
}

export function ResumeListClient({ initialResumes }: ResumeListClientProps) {
  const router = useRouter();
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: resumesList = initialResumes } = useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: () => getResumesAction() as any,
    initialData: initialResumes,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteResumeAction(id),
    onSuccess: () => {
      toast.success("Resume berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setResumeToDelete(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Terjadi kesalahan saat menghapus resume");
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { id: string; content: ResumeContent; title: string }) =>
      createResumeAction(data),
    onSuccess: (newResume) => {
      toast.success("Resume berhasil dibuat! 🚀");
      setIsChoiceOpen(false);
      setIsImportOpen(false);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      router.push(`/resume-builder/${newResume.id}`);
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast.error("Gagal membuat resume. Coba lagi.");
    },
  });

  const handleImportComplete = (content: ResumeContent) => {
    const newId = crypto.randomUUID();
    createMutation.mutate({
      id: newId,
      content,
      title: "Imported Resume",
    });
  };

  const handleDelete = () => {
    if (resumeToDelete) {
      deleteMutation.mutate(resumeToDelete);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Buat dan kelola resume ATS-friendly kamu
          </p>
        </div>
        <Button
          onClick={() => setIsChoiceOpen(true)}
          className="bg-primary hover:bg-primary/90 hover:shadow-primary/30 text-primary-foreground flex items-center gap-2 px-4 py-5 text-sm font-semibold transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Buat Resume Baru
        </Button>
      </div>

      {resumesList.length === 0 ? (
        <div className="border-border flex flex-col items-center justify-center border border-dashed py-20 text-center">
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-xl">
            <FileText className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">
            Belum ada resume
          </h3>
          <p className="text-muted-foreground mt-2 max-w-xs text-sm">
            Buat resume pertama kamu yang ATS-friendly dan siap untuk dikirim ke
            perusahaan impian.
          </p>
          <Button
            onClick={() => setIsChoiceOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground mt-6 flex items-center gap-2 px-6 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Buat Resume Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumesList.map((resume) => (
            <Link
              key={resume.id}
              href={`/resume-builder/${resume.id}`}
              className="glass group hover:border-primary/30 hover:shadow-primary/10 p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-primary/20 flex h-12 w-12 items-center justify-center">
                  <FileText className="text-primary h-6 w-6" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-destructive hover:bg-destructive/10 text-muted-foreground -mt-2 -mr-2 h-8 w-8 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setResumeToDelete(resume.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="group-hover:text-primary text-foreground font-semibold transition-colors">
                {resume.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-xs">
                Diupdate {formatDate(resume.updatedAt)}
              </p>
              {resume.atsScore !== null && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                    <div
                      className="from-primary to-primary/60 h-full bg-linear-to-r"
                      style={{ width: `${resume.atsScore}%` }}
                    />
                  </div>
                  <span className="text-primary text-xs font-medium">
                    {resume.atsScore}% ATS
                  </span>
                </div>
              )}
              {/* Completeness Score */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                  <span className="text-muted-foreground">
                    Kelengkapan Data
                  </span>
                  <span className="text-primary">
                    {calculateCompleteness(resume.content as any).score}%
                  </span>
                </div>
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{
                      width: `${calculateCompleteness(resume.content as any).score}%`,
                    }}
                  />
                </div>
              </div>

              <div className="text-muted-foreground group-hover:text-foreground mt-4 flex items-center gap-1 text-xs transition-colors">
                Edit Resume <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}

          {/* New resume card */}
          <button
            onClick={() => setIsChoiceOpen(true)}
            className="hover:border-primary/30 hover:bg-muted/50 border-border flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all"
          >
            <div className="border-border mb-3 flex h-12 w-12 items-center justify-center border border-dashed">
              <Plus className="text-muted-foreground h-5 w-5" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Buat Resume Baru
            </span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!resumeToDelete}
        onOpenChange={(open) => !open && setResumeToDelete(null)}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <div className="bg-destructive/10 mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Resume?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Resume kamu akan dihapus
              secara permanen dari server kami.
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
                "Ya, Hapus Resume"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Choice Dialog */}
      <Dialog open={isChoiceOpen} onOpenChange={setIsChoiceOpen}>
        <DialogContent className="bg-background border-border sm:max-w-150">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Buat Resume Baru
            </DialogTitle>
            <DialogDescription>
              Pilih cara kamu ingin memulai pembuatan resume.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <button
              onClick={() => {
                setIsChoiceOpen(false);
                router.push("/resume-builder/new");
              }}
              className="bg-muted/50 hover:border-primary/50 group hover:bg-muted border-border flex flex-col items-center gap-4 rounded-2xl border p-8 text-center transition-all"
            >
              <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                <PencilLine className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-foreground text-lg font-bold">
                  Mulai dari Nol
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Bangun resume kamu langkah demi langkah.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsChoiceOpen(false);
                setIsImportOpen(true);
              }}
              className="bg-primary/5 border-primary/20 hover:border-primary/50 group hover:bg-primary/10 flex flex-col items-center gap-4 rounded-2xl border p-8 text-center transition-all"
            >
              <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:scale-110">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-foreground text-lg font-bold">
                  Impor CV Lama (AI)
                </h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Gunakan AI untuk mengisi data dari PDF kamu.
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ResumeImportDialog
        isOpen={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImportComplete={handleImportComplete}
      />

      {createMutation.isPending && (
        <div className="bg-background/80 fixed inset-0 z-100 flex flex-col items-center justify-center backdrop-blur-sm">
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <p className="text-foreground mt-4 font-medium italic">
            Sedang menyiapkan resume kamu...
          </p>
        </div>
      )}
    </div>
  );
}
