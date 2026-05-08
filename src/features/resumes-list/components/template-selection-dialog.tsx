"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, LayoutTemplate } from "lucide-react";
import type { ResumeTemplateId } from "@/features/resumes-list/types/resume";
import { cn } from "@/lib/utils";

interface TemplateSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (templateId: ResumeTemplateId) => void;
  isLoading?: boolean;
}

const templates: {
  id: ResumeTemplateId;
  name: string;
  description: string;
  previewClass: string;
}[] = [
  {
    id: "classic",
    name: "Classic ATS",
    description:
      "Desain profesional standar dengan struktur konvensional. Sangat aman dan direkomendasikan untuk ATS.",
    previewClass: "bg-white border-gray-300",
  },
  {
    id: "modern",
    name: "Modern Clean",
    description:
      "Tampilan bersih dengan sentuhan modern pada header. Tetap mempertahankan format satu kolom agar mudah dibaca mesin.",
    previewClass: "bg-slate-50 border-slate-300",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description:
      "Desain lega dengan banyak whitespace. Cocok untuk industri kreatif atau startup.",
    previewClass: "bg-zinc-50 border-zinc-200",
  },
];

export function TemplateSelectionDialog({
  isOpen,
  onOpenChange,
  onSelect,
  isLoading,
}: TemplateSelectionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <LayoutTemplate className="text-primary h-6 w-6" />
            Pilih Template Resume
          </DialogTitle>
          <DialogDescription>
            Semua template dirancang agar ATS-friendly (satu kolom, font
            standar, mudah di-parsing). Anda bisa menggantinya nanti.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group border-border hover:border-primary/50 relative flex flex-col rounded-none border transition-all hover:shadow-lg"
            >
              {/* Fake Preview */}
              <div
                className={cn(
                  "relative aspect-[1/1.4] w-full overflow-hidden border-b p-4 transition-transform group-hover:scale-[1.02]",
                  template.previewClass,
                )}
              >
                {/* Visual representation of the template */}
                <div className="flex h-full w-full flex-col gap-2 opacity-50">
                  {template.id === "modern" ? (
                    <div className="mb-2 flex items-end justify-between border-b-2 border-black pb-2">
                      <div className="h-6 w-1/2 rounded-sm bg-black" />
                      <div className="h-3 w-1/4 rounded-sm bg-gray-500" />
                    </div>
                  ) : template.id === "minimal" ? (
                    <div className="mb-4 flex flex-col items-center gap-1">
                      <div className="h-5 w-1/2 rounded-sm bg-zinc-800" />
                      <div className="h-2 w-1/3 rounded-sm bg-zinc-400" />
                    </div>
                  ) : (
                    <div className="mb-2 flex flex-col items-center gap-1 border-b border-black pb-2">
                      <div className="h-6 w-2/3 rounded-sm bg-black" />
                      <div className="h-2 w-1/2 rounded-sm bg-gray-600" />
                    </div>
                  )}

                  {/* Body Content Mockup */}
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="mb-1 h-3 w-1/3 rounded-sm bg-black/70" />
                    <div className="h-2 w-full rounded-sm bg-gray-300" />
                    <div className="h-2 w-5/6 rounded-sm bg-gray-300" />
                    <div className="h-2 w-4/6 rounded-sm bg-gray-300" />
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="mb-1 h-3 w-1/4 rounded-sm bg-black/70" />
                    <div className="h-2 w-full rounded-sm bg-gray-300" />
                    <div className="h-2 w-full rounded-sm bg-gray-300" />
                  </div>
                </div>
              </div>

              {/* Info & Action */}
              <div className="bg-muted/20 flex flex-1 flex-col p-4">
                <h4 className="text-foreground text-lg font-bold">
                  {template.name}
                </h4>
                <p className="text-muted-foreground mt-1 mb-4 flex-1 text-sm">
                  {template.description}
                </p>
                <Button
                  onClick={() => onSelect(template.id)}
                  disabled={isLoading}
                  className="w-full gap-2 font-bold"
                >
                  Gunakan {template.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
