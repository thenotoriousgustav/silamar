"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Briefcase,
  Copy,
  FileText,
  Loader2,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// eslint-disable-next-line import/no-restricted-paths -- Resumes list needs resume creation actions
import {
  createEmptyResumeAction,
  createResumeAction,
} from "@/features/resume-builder/actions";
import {
  deleteResumeAction,
  getResumesAction,
} from "@/features/resumes-list/actions";
import { duplicateResumeAction } from "@/features/resumes-list/actions/duplicate-resume";
import { bulkDeleteResumesAction } from "@/features/resumes-list/actions/bulk-delete-resumes";
import type { ResumeContent, ResumeTemplateId } from "@/types/resume";
import { calculateCompleteness } from "@/features/resumes-list/utils/completeness";
import { DocumentCard } from "@/shared/document-card";
import { EmptyState } from "@/shared/empty-state";
import { LoadingOverlay } from "@/shared/loading-spinner";
import { PageHeader } from "@/shared/page-header";

import { ResumeImportDialog } from "./resume-import-dialog";
import { ResumePreviewDrawer } from "./resume-preview-drawer";
import { TemplateSelectionDialog } from "./template-selection-dialog";

interface Resume {
  id: string;
  title: string;
  updatedAt: Date;
  atsScore: number | null;
  content: any;
  trackers?: { id: string; name: string }[];
  jobUsages?: { id: string; position: string; company: string }[];
}

interface ResumeListClientProps {
  initialResumes: Resume[];
}

export function ResumeListClient({ initialResumes }: ResumeListClientProps) {
  const router = useRouter();
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const [isTemplateSelectOpen, setIsTemplateSelectOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [selectedResumeForPreview, setSelectedResumeForPreview] =
    useState<Resume | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplateId | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState("");

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);

  const queryClient = useQueryClient();

  const { data: resumesList = initialResumes } = useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: () => getResumesAction(),
    initialData: initialResumes,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteResumeAction(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
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
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Resume berhasil dibuat! 🚀");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      router.push(`/resume-builder/${result.data.id}`);
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast.error("Gagal membuat resume. Coba lagi.");
    },
  });

  const createEmptyMutation = useMutation({
    mutationFn: (templateId: ResumeTemplateId) =>
      createEmptyResumeAction(templateId),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Resume berhasil dibuat! 🚀");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      router.push(`/resume-builder/${result.data.id}`);
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast.error("Gagal membuat resume. Coba lagi.");
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicateResumeAction(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Resume berhasil diduplikat");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: () => {
      toast.error("Gagal menduplikat resume");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteResumesAction(ids),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`${result.data.deletedCount} resume berhasil dihapus`);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setSelectedIds(new Set());
      setIsBulkMode(false);
    },
    onError: () => {
      toast.error("Gagal menghapus resume");
    },
  });

  const handleImportComplete = (content: ResumeContent) => {
    setIsImportOpen(false);

    // Create resume with imported content and already selected template
    if (selectedTemplate) {
      const newId = crypto.randomUUID();
      createMutation.mutate({
        id: newId,
        content: {
          ...content,
          style: {
            ...content.style,
            fontFamily: content.style?.fontFamily || "Inter",
            fontSize: content.style?.fontSize || "text-[11px]",
            language: content.style?.language || "id",
            lineHeight: content.style?.lineHeight || "relaxed",
            templateId: selectedTemplate,
          },
        },
        title: content.personalInfo.fullName
          ? `${content.personalInfo.fullName} Resume`
          : "Imported Resume",
      });
    }
  };

  const handleTemplateSelect = (templateId: ResumeTemplateId) => {
    setSelectedTemplate(templateId);
    setIsTemplateSelectOpen(false);
    setIsChoiceOpen(true);
  };

  const handleStartFromScratch = () => {
    if (selectedTemplate) {
      createEmptyMutation.mutate(selectedTemplate);
    }
  };

  const handleDelete = () => {
    if (resumeToDelete) {
      deleteMutation.mutate(resumeToDelete);
    }
  };

  // Filter resumes by search query
  const filteredResumes = searchQuery.trim()
    ? resumesList.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : resumesList;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      bulkDeleteMutation.mutate(Array.from(selectedIds));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume"
        description="Buat dan kelola resume ATS-friendly kamu"
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="border-border bg-background relative flex items-center rounded-none border">
            <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari resume..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-48 bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Bulk mode toggle */}
          {resumesList.length > 1 && (
            <Button
              variant={isBulkMode ? "secondary" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => {
                setIsBulkMode(!isBulkMode);
                setSelectedIds(new Set());
              }}
            >
              {isBulkMode ? "Batal" : "Pilih"}
            </Button>
          )}

          {/* Bulk delete button */}
          {isBulkMode && selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="h-9 gap-2"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Hapus ({selectedIds.size})
            </Button>
          )}

          <Button
            onClick={() => setIsTemplateSelectOpen(true)}
            className="bg-primary hover:bg-primary/90 hover:shadow-primary/30 text-primary-foreground flex items-center gap-2 px-4 py-5 text-sm font-semibold transition-all hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Buat Resume Baru
          </Button>
        </div>
      </PageHeader>

      {resumesList.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="Belum ada resume"
          description="Buat resume pertama kamu yang ATS-friendly dan siap untuk dikirim ke perusahaan impian."
          action={
            <Button
              onClick={() => setIsTemplateSelectOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-6 py-3 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              Buat Resume Pertama
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResumes.map((resume) => (
            <div key={resume.id} className="relative">
              {/* Bulk selection checkbox */}
              {isBulkMode && (
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(resume.id)}
                    onChange={() => toggleSelection(resume.id)}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                </div>
              )}

              <DocumentCard
                title={resume.title}
                updatedAt={resume.updatedAt}
                icon={<FileText className="text-primary h-6 w-6" />}
                onDelete={() => setResumeToDelete(resume.id)}
                onDuplicate={() => duplicateMutation.mutate(resume.id)}
                onClick={() => {
                  if (isBulkMode) {
                    toggleSelection(resume.id);
                    return;
                  }
                  setSelectedResumeForPreview(resume);
                  setIsPreviewOpen(true);
                }}
                href={`/resume-builder/${resume.id}`}
                linkText="Edit Resume"
                className={selectedIds.has(resume.id) ? "ring-2 ring-primary" : ""}
              >
              {resume.atsScore !== null && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-none">
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
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-none">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{
                      width: `${calculateCompleteness(resume.content as any).score}%`,
                    }}
                  />
                </div>
              </div>
              {/* Job Usage — compact count */}
              <div className="border-border/50 mt-4 border-t pt-3">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
                  <Briefcase className="h-3 w-3" />
                  <span>
                    Digunakan di{" "}
                    <span className="text-foreground font-semibold">
                      {resume.jobUsages?.length || 0}
                    </span>{" "}
                    lamaran
                  </span>
                </div>
              </div>
            </DocumentCard>
            </div>
          ))}

          {/* New resume card */}
          <button
            onClick={() => setIsTemplateSelectOpen(true)}
            className="hover:border-primary/30 hover:bg-muted/50 border-border flex flex-col items-center justify-center rounded-none border border-dashed p-6 text-center transition-all"
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
            <div className="bg-destructive/10 mb-2 flex h-12 w-12 items-center justify-center rounded-none">
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
        <DialogContent className="bg-background border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Lengkapi Data Resume
            </DialogTitle>
            <DialogDescription>
              Pilih cara kamu ingin mengisi konten resume kamu.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <button
              onClick={() => {
                setIsChoiceOpen(false);
                handleStartFromScratch();
              }}
              className="bg-muted/50 hover:border-primary/50 group hover:bg-muted border-border flex flex-col items-center gap-4 rounded-none border p-6 text-center transition-all"
            >
              <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-none transition-transform group-hover:scale-110">
                <PencilLine className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-foreground text-base font-bold">
                  Dari Nol
                </h4>
                <p className="text-muted-foreground mt-1 text-xs">
                  Isi manual langkah demi langkah.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsChoiceOpen(false);
                setIsImportOpen(true);
              }}
              className="bg-primary/5 border-primary/20 hover:border-primary/50 group hover:bg-primary/10 flex flex-col items-center gap-4 rounded-none border p-6 text-center transition-all"
            >
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-none text-white shadow-lg transition-transform group-hover:scale-110">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-foreground text-base font-bold">
                  Impor PDF (AI)
                </h4>
                <p className="text-muted-foreground mt-1 text-xs">
                  Ekstrak data dari CV lama kamu.
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

      <TemplateSelectionDialog
        isOpen={isTemplateSelectOpen}
        onOpenChange={setIsTemplateSelectOpen}
        onSelect={handleTemplateSelect}
        isLoading={createEmptyMutation.isPending || createMutation.isPending}
      />

      <ResumePreviewDrawer
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        resume={selectedResumeForPreview}
      />

      {(createMutation.isPending || createEmptyMutation.isPending) &&
        !isTemplateSelectOpen && (
          <LoadingOverlay label="Sedang menyiapkan resume kamu..." />
        )}
    </div>
  );
}
