"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles, Loader2, FileText, Layout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Accordion } from "@/components/ui/accordion";
import { CoverLetterBuilderData } from "./schema";
import { COVER_LETTER_TEMPLATES } from "./templates";

// Import Modular Sections
import { PersonalInfoSection } from "./form-sections/personal-info-section";
import { RecipientSection } from "./form-sections/recipient-section";
import { ContentSection } from "./form-sections/content-section";

interface CoverLetterFormProps {
  content: CoverLetterBuilderData;
  updateContent: (update: Partial<CoverLetterBuilderData>) => void;
}

export function CoverLetterForm({
  content = {} as CoverLetterBuilderData,
  updateContent,
}: CoverLetterFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "personal",
    "recipient",
    "content",
  ]);

  // AI Generation State
  const [aiInput, setAiInput] = useState({
    resumeContent: "",
    jobTitle: "",
    company: "",
    jobDescription: "",
    tone: "professional" as const,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiInput),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal generate");
      return json.data;
    },
    onSuccess: (data) => {
      updateContent({
        content: data.coverLetter,
        subject: data.subject,
        companyName: aiInput.company,
      });
      toast.success("Cover letter berhasil di-generate! ✨");
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleApplyTemplate = (
    templateData: Partial<CoverLetterBuilderData>,
  ) => {
    updateContent(templateData);
    toast.success("Template berhasil diterapkan! 📝");
    setIsTemplateModalOpen(false);
  };

  return (
    <div className="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto p-6">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {/* Template Picker */}
          <Dialog
            open={isTemplateModalOpen}
            onOpenChange={setIsTemplateModalOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Layout className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Template</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Pilih Template Profesional
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3">
                {COVER_LETTER_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleApplyTemplate(template.data)}
                    className="border-border hover:border-primary/30 bg-card group flex flex-col rounded-none border p-4 text-left transition-all hover:shadow-sm"
                  >
                    <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-none transition-transform group-hover:scale-110">
                      <FileText className="text-primary h-5 w-5" />
                    </div>
                    <h3 className="text-foreground mb-1 font-semibold">
                      {template.name}
                    </h3>
                    <p className="text-muted-foreground text-[10px] leading-relaxed">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* AI Generate */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/50 text-primary hover:bg-primary/10 h-8 gap-2 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">AI Generate</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>AI Cover Letter Generator</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Posisi yang Dilamar
                  </Label>
                  <Input
                    value={aiInput.jobTitle}
                    onChange={(e) =>
                      setAiInput({ ...aiInput, jobTitle: e.target.value })
                    }
                    placeholder="e.g. Senior Frontend Developer"
                    className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Nama Perusahaan
                  </Label>
                  <Input
                    value={aiInput.company}
                    onChange={(e) =>
                      setAiInput({ ...aiInput, company: e.target.value })
                    }
                    placeholder="e.g. Google"
                    className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Konten Resume
                  </Label>
                  <Textarea
                    value={aiInput.resumeContent}
                    onChange={(e) =>
                      setAiInput({ ...aiInput, resumeContent: e.target.value })
                    }
                    placeholder="Tempel isi resume Anda di sini..."
                    rows={5}
                    className="bg-background border-border focus:border-primary focus:ring-primary resize-none text-xs transition-all focus:ring-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => mutation.mutate()}
                  disabled={
                    mutation.isPending ||
                    !aiInput.resumeContent ||
                    !aiInput.jobTitle ||
                    !aiInput.company
                  }
                  className="h-10 w-full gap-2 font-bold"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sedang Menulis...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Sekarang
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Form Sections */}
      <Accordion
        value={expandedItems}
        onValueChange={setExpandedItems}
        type="multiple"
        className="w-full space-y-4 border-none"
      >
        <PersonalInfoSection content={content} updateContent={updateContent} />
        <RecipientSection content={content} updateContent={updateContent} />
        <ContentSection content={content} updateContent={updateContent} />
      </Accordion>
    </div>
  );
}
