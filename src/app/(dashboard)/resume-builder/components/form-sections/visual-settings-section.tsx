"use client";

import {
  Settings2,
  ChevronDown,
  LayoutTemplate,
  Languages,
} from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ResumeContent } from "@/types/resume";

interface VisualSettingsSectionProps {
  content: ResumeContent;
  updateStyle: (style: Partial<ResumeContent["style"]>) => void;
}

export function VisualSettingsSection({
  content,
  updateStyle,
}: VisualSettingsSectionProps) {
  return (
    <AccordionItem
      value="style"
      className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
    >
      <AccordionTrigger
        asChild
        className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline"
      >
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
            <Settings2 className="h-4 w-4" />
          </div>
          <span className="text-foreground font-semibold tracking-tight">
            Pengaturan Visual
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pt-2 pb-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Jenis Font
            </Label>
            <div className="relative">
              <select
                value={content.style?.fontFamily || "Helvetica"}
                onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                className="bg-background border-border focus:border-primary focus:ring-primary h-11 w-full appearance-none rounded-none border px-4 py-2 text-sm transition-all focus:ring-1"
              >
                <option value="Calibri">Calibri</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
              </select>
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Ukuran Font
            </Label>
            <div className="flex gap-2">
              {["text-xs", "text-sm", "text-base"].map((size) => (
                <Button
                  key={size}
                  variant={
                    content.style?.fontSize === size ? "default" : "outline"
                  }
                  className="h-11 flex-1 transition-all"
                  onClick={() => updateStyle({ fontSize: size })}
                >
                  {size === "text-xs"
                    ? "Kecil"
                    : size === "text-sm"
                      ? "Sedang"
                      : "Besar"}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3 md:col-span-2">
            <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
              <LayoutTemplate className="h-3.5 w-3.5" /> Template Resume
            </Label>
            <div className="flex gap-2">
              {[
                { id: "classic", label: "Classic" },
                { id: "modern", label: "Modern" },
                { id: "minimal", label: "Minimal" },
              ].map((template) => (
                <Button
                  key={template.id}
                  variant={
                    (content.style?.templateId || "classic") === template.id
                      ? "default"
                      : "outline"
                   }
                  className="h-11 flex-1 transition-all"
                  onClick={() =>
                    updateStyle({ templateId: template.id as any })
                  }
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3 md:col-span-2">
            <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
              <Languages className="h-3.5 w-3.5" /> Bahasa Resume (PDF)
            </Label>
            <div className="flex gap-2">
              {[
                { id: "id", label: "Indonesia" },
                { id: "en", label: "Inggris" },
              ].map((lang) => (
                <Button
                  key={lang.id}
                  variant={
                    (content.style?.language || "id") === lang.id
                      ? "default"
                      : "outline"
                  }
                  className="h-11 flex-1 transition-all"
                  onClick={() =>
                    updateStyle({ language: lang.id as "id" | "en" })
                  }
                >
                  {lang.label}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground text-[10px] italic">
              * Ini akan menentukan bahasa yang digunakan pada tampilan PDF
              akhir.
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
