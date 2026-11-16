"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Check, Eye, Mail, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// eslint-disable-next-line import/no-restricted-paths -- Job tracker needs cover letter preview for selection
import { CoverLetterPreview } from "@/features/cover-letter-builder/components/cover-letter-preview";
import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";
import { cn } from "@/lib/utils";

interface CoverLetter {
  id: string;
  title: string;
  updatedAt: Date;
  company: string | null;
  jobTitle: string | null;
  content: any;
}

interface CoverLetterSelectorDialogProps {
  coverLetters: CoverLetter[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (coverLetterId: string) => void;
  selectedId?: string | null;
}

export function CoverLetterSelectorDialog({
  coverLetters,
  open,
  onOpenChange,
  onSelect,
  selectedId,
}: CoverLetterSelectorDialogProps) {
  const [search, setSearch] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(
    selectedId || (coverLetters.length > 0 ? coverLetters[0].id : null),
  );
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (previewId) {
      setOpenedIds((prev) => new Set(prev).add(previewId));
    }
  }, [previewId]);

  const filtered = coverLetters.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = coverLetters.find((c) => c.id === previewId);

  const handleSelect = (id: string) => {
    onSelect(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="bg-background/95 border-border/50 flex h-[90vh] w-[95vw] flex-col overflow-hidden p-0 shadow-2xl backdrop-blur-xl sm:max-w-6xl">
        <div className="flex flex-1 overflow-hidden">
          {/* Left: List */}
          <div className="border-border/50 bg-muted/5 flex w-full flex-col border-r md:w-80 lg:w-96">
            <DialogHeader className="border-border/50 border-b p-4">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Mail className="text-primary h-5 w-5" />
                Pilih Cover Letter
              </DialogTitle>
              <DialogDescription>
                Pilih cover letter yang ingin Anda gunakan untuk lamaran ini.
              </DialogDescription>
              <div className="relative mt-3">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Cari cover letter..."
                  className="bg-background/50 border-border/50 focus-visible:ring-primary/20 rounded-none pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </DialogHeader>

            <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
                  <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-none">
                    <Mail className="text-muted-foreground h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Cover letter tidak ditemukan
                  </p>
                </div>
              ) : (
                filtered.map((cl) => (
                  <button
                    key={cl.id}
                    onClick={() => setPreviewId(cl.id)}
                    onDoubleClick={() => handleSelect(cl.id)}
                    className={cn(
                      "group relative w-full overflow-hidden rounded-none p-3 text-left transition-all duration-200",
                      previewId === cl.id
                        ? "bg-primary/10 border-primary/20 shadow-inner"
                        : "hover:bg-muted/50 border border-transparent",
                    )}
                  >
                    {previewId === cl.id && (
                      <div className="bg-primary absolute top-0 bottom-0 left-0 w-1" />
                    )}
                    <div className="mb-1 flex items-start justify-between">
                      <h4
                        className={cn(
                          "flex-1 truncate pr-2 text-sm font-bold",
                          previewId === cl.id
                            ? "text-primary"
                            : "text-foreground",
                        )}
                      >
                        {cl.title}
                      </h4>
                      {cl.id === selectedId && (
                        <div className="bg-primary rounded-none p-0.5 text-black">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    <div className="text-muted-foreground flex items-center gap-3 text-[10px] font-medium tracking-wider uppercase">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(cl.updatedAt), "d MMM yyyy", {
                          locale: id,
                        })}
                      </span>
                      {cl.company && (
                        <span className="truncate">{cl.company}</span>
                      )}
                    </div>

                    {previewId === cl.id && (
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
                href="/documents/cover-letter"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "hover:border-primary hover:text-primary h-8 w-full rounded-none border-dashed transition-all",
                )}
              >
                <Plus className="mr-2 h-3 w-3" /> Buat Cover Letter Baru
              </a>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="bg-muted/10 relative hidden flex-1 flex-col md:flex">
            {selected ? (
              <div className="flex h-full flex-1 flex-col overflow-hidden">
                <div className="border-border/50 bg-background/50 z-10 flex items-center justify-between border-b p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center text-xs font-bold">
                      PDF
                    </div>
                    <div>
                      <h3 className="text-sm leading-tight font-bold">
                        {selected.title}
                      </h3>
                      <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                        Preview Mode
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="shadow-primary/20 gap-2 font-bold shadow-lg"
                    onClick={() => handleSelect(selected.id)}
                  >
                    Gunakan Cover Letter Ini
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted/30 relative flex flex-1 justify-center overflow-y-auto p-8">
                  {coverLetters.map((cl) => {
                    const isOpened = openedIds.has(cl.id);
                    const isActive = previewId === cl.id;

                    if (!isOpened && !isActive) return null;

                    return (
                      <div
                        key={cl.id}
                        className="w-full max-w-3xl origin-top shadow-2xl"
                        style={{ display: isActive ? "block" : "none" }}
                      >
                        <CoverLetterPreview
                          content={cl.content as Partial<CoverLetterBuilderData>}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
                <div className="bg-muted/50 border-border mb-6 flex h-20 w-20 items-center justify-center rounded-none border border-dashed">
                  <Mail className="text-muted-foreground/30 h-10 w-10" />
                </div>
                <h3 className="text-muted-foreground/50 text-lg font-bold tracking-widest uppercase">
                  Pratinjau Cover Letter
                </h3>
                <p className="text-muted-foreground mt-2 max-w-xs text-sm">
                  Pilih cover letter di daftar sebelah kiri untuk melihat
                  detail konten dan tampilannya.
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
