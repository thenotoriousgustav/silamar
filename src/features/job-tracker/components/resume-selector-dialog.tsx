"use client";

import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Check,
  Eye,
  Calendar,
  Sparkles,
  Loader2,
  X,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ResumePreview } from "@/features/resume-builder/components/resume-preview";
import type { ResumeContent } from "@/features/resumes-list/types/resume";

interface Resume {
  id: string;
  title: string;
  updatedAt: Date;
  atsScore: number | null;
  content: any;
}

interface ResumeSelectorDialogProps {
  resumes: Resume[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (resumeId: string) => void;
  selectedId?: string | null;
}

export function ResumeSelectorDialog({
  resumes,
  open,
  onOpenChange,
  onSelect,
  selectedId,
}: ResumeSelectorDialogProps) {
  const [search, setSearch] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(
    selectedId || (resumes.length > 0 ? resumes[0].id : null),
  );
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  // Track which resumes have been opened to keep them cached in DOM
  useEffect(() => {
    if (previewId) {
      setOpenedIds((prev) => new Set(prev).add(previewId));
    }
  }, [previewId]);

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedResume = resumes.find((r) => r.id === previewId);

  const handleSelect = (id: string) => {
    onSelect(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="bg-background/95 border-border/50 flex h-[90vh] w-[95vw] flex-col overflow-hidden p-0 shadow-2xl backdrop-blur-xl sm:max-w-6xl">
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side: List */}
          <div className="border-border/50 bg-muted/5 flex w-full flex-col border-r md:w-80 lg:w-96">
            <DialogHeader className="border-border/50 border-b p-4">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <FileText className="text-primary h-5 w-5" />
                Pilih Resume
              </DialogTitle>
              <DialogDescription>
                Pilih resume yang ingin Anda gunakan untuk lamaran ini.
              </DialogDescription>
              <div className="relative mt-3">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Cari resume..."
                  className="bg-background/50 border-border/50 focus-visible:ring-primary/20 rounded-none pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </DialogHeader>

            <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
              {filteredResumes.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
                  <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-none">
                    <FileText className="text-muted-foreground h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Resume tidak ditemukan
                  </p>
                </div>
              ) : (
                filteredResumes.map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => setPreviewId(resume.id)}
                    onDoubleClick={() => handleSelect(resume.id)}
                    className={cn(
                      "group relative w-full overflow-hidden rounded-none p-3 text-left transition-all duration-200",
                      previewId === resume.id
                        ? "bg-primary/10 border-primary/20 shadow-inner"
                        : "hover:bg-muted/50 border border-transparent",
                    )}
                  >
                    {previewId === resume.id && (
                      <div className="bg-primary absolute top-0 bottom-0 left-0 w-1" />
                    )}
                    <div className="mb-1 flex items-start justify-between">
                      <h4
                        className={cn(
                          "flex-1 truncate pr-2 text-sm font-bold",
                          previewId === resume.id
                            ? "text-primary"
                            : "text-foreground",
                        )}
                      >
                        {resume.title}
                      </h4>
                      {resume.id === selectedId && (
                        <div className="bg-primary rounded-none p-0.5 text-black">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    <div className="text-muted-foreground flex items-center gap-3 text-[10px] font-medium tracking-wider uppercase">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(resume.updatedAt), "d MMM yyyy", {
                          locale: id,
                        })}
                      </span>
                      {resume.atsScore !== null && (
                        <span className="text-primary flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {resume.atsScore}% ATS
                        </span>
                      )}
                    </div>

                    {previewId === resume.id && (
                      <div className="mt-3 flex items-center justify-end">
                        <span className="text-primary flex animate-pulse items-center gap-1 text-[10px] font-bold">
                          <Eye className="h-3 w-3" /> PREVIEW AKTIF
                        </span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="border-border/50 bg-muted/20 border-t p-4">
              <a
                href="/documents/resumes"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "hover:border-primary hover:text-primary h-8 w-full rounded-none border-dashed transition-all",
                )}
              >
                <Plus className="mr-2 h-3 w-3" /> Buat Resume Baru
              </a>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="bg-muted/10 relative hidden flex-1 flex-col md:flex">
            {selectedResume ? (
              <div className="flex h-full flex-1 flex-col overflow-hidden">
                <div className="border-border/50 bg-background/50 z-10 flex items-center justify-between border-b p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center text-xs font-bold">
                      PDF
                    </div>
                    <div>
                      <h3 className="text-sm leading-tight font-bold">
                        {selectedResume.title}
                      </h3>
                      <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                        Preview Mode
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="shadow-primary/20 gap-2 font-bold shadow-lg"
                    onClick={() => handleSelect(selectedResume.id)}
                  >
                    Gunakan Resume Ini
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted/30 relative flex flex-1 justify-center overflow-y-auto p-8">
                  {resumes.map((resume) => {
                    const isOpened = openedIds.has(resume.id);
                    const isActive = previewId === resume.id;

                    if (!isOpened && !isActive) return null;

                    return (
                      <div
                        key={resume.id}
                        className={cn(
                          "w-full max-w-3xl origin-top shadow-2xl transition-all duration-300",
                          isActive
                            ? "scale-100 opacity-100"
                            : "pointer-events-none absolute scale-95 opacity-0",
                        )}
                        style={{ display: isActive ? "block" : "none" }}
                      >
                        <ResumePreview
                          content={resume.content as ResumeContent}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
                <div className="bg-muted/50 border-border mb-6 flex h-20 w-20 items-center justify-center rounded-none border border-dashed">
                  <FileText className="text-muted-foreground/30 h-10 w-10" />
                </div>
                <h3 className="text-muted-foreground/50 text-lg font-bold tracking-widest uppercase">
                  Pratinjau Resume
                </h3>
                <p className="text-muted-foreground mt-2 max-w-xs text-sm">
                  Pilih resume di daftar sebelah kiri untuk melihat detail
                  konten dan tampilannya.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="border-border/50 bg-background flex gap-2 border-t p-4 md:hidden">
          <Button
            variant="outline"
            className="h-11 flex-1 rounded-none font-bold"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            className="h-11 flex-1 rounded-none font-bold"
            disabled={!previewId}
            onClick={() => previewId && handleSelect(previewId)}
          >
            Pilih
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
