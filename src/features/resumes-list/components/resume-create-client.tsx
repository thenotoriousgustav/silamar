"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PencilLine, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
// eslint-disable-next-line import/no-restricted-paths -- Resumes list needs resume creation actions
import {
  createEmptyResumeAction,
  createResumeAction,
} from "@/features/resume-builder/actions";
import type { ResumeContent, ResumeTemplateId } from "@/types/resume";

import { ResumeImportDialog } from "./resume-import-dialog";
import { TemplateSelectionDialog } from "./template-selection-dialog";

export function ResumeCreateClient() {
  const router = useRouter();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isTemplateSelectOpen, setIsTemplateSelectOpen] = useState(false);
  const [pendingCreationType, setPendingCreationType] = useState<
    "empty" | "import" | null
  >(null);
  const [importedContent, setImportedContent] = useState<ResumeContent | null>(
    null,
  );
  const queryClient = useQueryClient();

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

  const handleImportComplete = (content: ResumeContent) => {
    setImportedContent(content);
    setIsImportOpen(false);
    setPendingCreationType("import");
    setIsTemplateSelectOpen(true);
  };

  const handleTemplateSelect = (templateId: ResumeTemplateId) => {
    setIsTemplateSelectOpen(false);
    if (pendingCreationType === "empty") {
      createEmptyMutation.mutate(templateId);
    } else if (pendingCreationType === "import" && importedContent) {
      const newId = crypto.randomUUID();
      createMutation.mutate({
        id: newId,
        content: {
          ...importedContent,
          style: {
            ...importedContent.style,
            fontFamily: "font-serif",
            fontSize: "text-sm",
            language: "id",
            templateId: templateId,
          },
        },
        title: "Imported Resume",
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-foreground text-3xl font-bold">Buat Resume Baru</h1>
        <p className="text-muted-foreground mt-2">
          Pilih cara kamu ingin memulai pembuatan resume ATS-friendly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <button
          onClick={() => {
            setPendingCreationType("empty");
            setIsTemplateSelectOpen(true);
          }}
          className="bg-muted/30 hover:border-primary/50 group hover:bg-muted/50 border-border flex flex-col items-center gap-6 rounded-none border p-12 text-center transition-all"
        >
          <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-none transition-transform group-hover:scale-110">
            <PencilLine className="h-10 w-10" />
          </div>
          <div>
            <h4 className="text-foreground text-xl font-bold">
              Mulai dari Nol
            </h4>
            <p className="text-muted-foreground mt-2">
              Bangun resume kamu langkah demi langkah dengan panduan kami.
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            setIsImportOpen(true);
          }}
          className="bg-primary/5 border-primary/20 hover:border-primary/50 group hover:bg-primary/10 flex flex-col items-center gap-6 rounded-none border p-12 text-center transition-all"
        >
          <div className="bg-primary flex h-20 w-20 items-center justify-center rounded-none text-white shadow-lg transition-transform group-hover:scale-110">
            <Sparkles className="h-10 w-10" />
          </div>
          <div>
            <h4 className="text-foreground text-xl font-bold">
              Impor CV Lama (AI)
            </h4>
            <p className="text-muted-foreground mt-2">
              Gunakan AI untuk mengekstrak data dari PDF lama kamu secara
              otomatis.
            </p>
          </div>
        </button>
      </div>

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

      {(createMutation.isPending || createEmptyMutation.isPending) &&
        !isTemplateSelectOpen && (
          <div className="bg-background/80 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
            <Loader2 className="text-primary h-12 w-12 animate-spin" />
            <p className="text-foreground mt-4 font-medium italic">
              Sedang menyiapkan resume kamu...
            </p>
          </div>
        )}
    </div>
  );
}
