"use client";

import { useState } from "react";
import { Upload, FileText, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { ResumeContent } from "@/types/resume";

interface ResumeImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (content: ResumeContent) => void;
}

export function ResumeImportDialog({
  isOpen,
  onOpenChange,
  onImportComplete,
}: ResumeImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Hanya file PDF yang diperbolehkan");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || "Gagal menganalisis resume");
      }

      const data = await response.json();
      onImportComplete(data);
      toast.success("Resume berhasil diimpor!");
      onOpenChange(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengimpor",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-foreground text-2xl font-bold">
            Impor Resume Lama
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-sans text-sm leading-relaxed">
            Unggah file PDF Resume kamu dan biarkan AI kami mengisinya secara
            otomatis untuk kamu.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!file ? (
            <div
              className="border-border bg-muted/20 hover:border-primary/50 group flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-12 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile?.type === "application/pdf") {
                  setFile(droppedFile);
                } else {
                  toast.error("Hanya file PDF yang diperbolehkan");
                }
              }}
            >
              <div className="bg-primary/10 text-primary rounded-2xl p-4 transition-transform group-hover:scale-110">
                <Upload className="h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="text-foreground text-sm font-semibold">
                  Klik untuk unggah atau seret file
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Hanya PDF (Maks. 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                id="resume-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("resume-upload")?.click()
                }
              >
                Pilih File
              </Button>
            </div>
          ) : (
            <div className="bg-muted/40 border-border relative flex items-center gap-4 rounded-2xl border p-5 shadow-xs">
              <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-xl">
                <FileText className="h-7 w-7" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-foreground truncate font-mono text-sm font-bold">
                  {file.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isAnalyzing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-9 w-9 rounded-full transition-colors"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium">Menganalisis CV kamu...</p>
                <p className="text-muted-foreground text-xs">
                  Ini mungkin memakan waktu beberapa detik
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-border/50 flex items-center justify-end gap-3 border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isAnalyzing}
            className="text-muted-foreground hover:bg-muted hover:text-foreground font-semibold"
          >
            Batal
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isAnalyzing}
            className="bg-primary hover:bg-primary/90 shadow-primary/20 text-primary-foreground gap-2 px-6 font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Mulai Impor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
