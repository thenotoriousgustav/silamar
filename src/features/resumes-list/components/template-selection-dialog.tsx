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
    description: "Desain profesional standar dengan struktur konvensional. Sangat aman dan direkomendasikan untuk ATS.",
    previewClass: "bg-white border-gray-300",
  },
  {
    id: "modern",
    name: "Modern Clean",
    description: "Tampilan bersih dengan sentuhan modern pada header. Tetap mempertahankan format satu kolom agar mudah dibaca mesin.",
    previewClass: "bg-slate-50 border-slate-300",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Desain lega dengan banyak whitespace. Cocok untuk industri kreatif atau startup.",
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
            <LayoutTemplate className="h-6 w-6 text-primary" />
            Pilih Template Resume
          </DialogTitle>
          <DialogDescription>
            Semua template dirancang agar ATS-friendly (satu kolom, font standar, mudah di-parsing). Anda bisa menggantinya nanti.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative flex flex-col rounded-none border border-border transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Fake Preview */}
              <div
                className={cn(
                  "aspect-[1/1.4] w-full border-b p-4 overflow-hidden relative transition-transform group-hover:scale-[1.02]",
                  template.previewClass
                )}
              >
                {/* Visual representation of the template */}
                <div className="h-full w-full flex flex-col gap-2 opacity-50">
                  {template.id === "modern" ? (
                     <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-2">
                       <div className="h-6 w-1/2 bg-black rounded-sm" />
                       <div className="h-3 w-1/4 bg-gray-500 rounded-sm" />
                     </div>
                  ) : template.id === "minimal" ? (
                     <div className="flex flex-col items-center mb-4 gap-1">
                       <div className="h-5 w-1/2 bg-zinc-800 rounded-sm" />
                       <div className="h-2 w-1/3 bg-zinc-400 rounded-sm" />
                     </div>
                  ) : (
                     <div className="flex flex-col items-center border-b border-black pb-2 mb-2 gap-1">
                       <div className="h-6 w-2/3 bg-black rounded-sm" />
                       <div className="h-2 w-1/2 bg-gray-600 rounded-sm" />
                     </div>
                  )}

                  {/* Body Content Mockup */}
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="h-3 w-1/3 bg-black/70 rounded-sm mb-1" />
                    <div className="h-2 w-full bg-gray-300 rounded-sm" />
                    <div className="h-2 w-5/6 bg-gray-300 rounded-sm" />
                    <div className="h-2 w-4/6 bg-gray-300 rounded-sm" />
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="h-3 w-1/4 bg-black/70 rounded-sm mb-1" />
                    <div className="h-2 w-full bg-gray-300 rounded-sm" />
                    <div className="h-2 w-full bg-gray-300 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex flex-1 flex-col p-4 bg-muted/20">
                <h4 className="text-lg font-bold text-foreground">
                  {template.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">
                  {template.description}
                </p>
                <Button
                  onClick={() => onSelect(template.id)}
                  disabled={isLoading}
                  className="w-full font-bold gap-2"
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
