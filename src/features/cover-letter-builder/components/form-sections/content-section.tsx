"use client";

import { AlignLeft } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

interface ContentSectionProps {
  content: CoverLetterBuilderData;
  updateContent: (update: Partial<CoverLetterBuilderData>) => void;
}

export function ContentSection({
  content,
  updateContent,
}: ContentSectionProps) {
  return (
    <AccordionItem
      value="content"
      className="bg-card border-border hover:border-primary/20 overflow-hidden border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex cursor-pointer items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
            <AlignLeft className="h-4 w-4" />
          </div>
          <span className="text-foreground font-semibold tracking-tight">
            Isi Surat
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="cl-subject"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Subjek Surat
            </Label>
            <Input
              id="cl-subject"
              value={content.subject || ""}
              onChange={(e) => updateContent({ subject: e.target.value })}
              placeholder="Lamaran Pekerjaan - [Nama Posisi]"
              className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cl-content"
              className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
            >
              Pesan
            </Label>
            <Textarea
              id="cl-content"
              value={content.content || ""}
              onChange={(e) => updateContent({ content: e.target.value })}
              placeholder="Tulis isi surat lamaran Anda di sini..."
              rows={14}
              className="bg-background border-border focus:border-primary focus:ring-primary custom-scrollbar min-h-[200px] resize-none font-mono text-[12px] leading-relaxed transition-all focus:ring-1"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
