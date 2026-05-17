"use client";

import {
  FileText,
  Languages,
  LayoutTemplate,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  RESUME_FONT_FAMILIES,
  type ResumeContent,
  type ResumeFontFamily,
  type ResumePaperSize,
  type ResumeTemplateId,
} from "@/types/resume";

import { TEMPLATE_LIST } from "../../templates/registry";

interface VisualSettingsPanelProps {
  content: ResumeContent;
  updateStyle: (style: Partial<ResumeContent["style"]>) => void;
}

const FONT_PREVIEW_CLASSES: Record<ResumeFontFamily, string> = {
  Inter: "font-resume-inter",
  Roboto: "font-resume-roboto",
  Lato: "font-resume-lato",
  Garamond: "font-resume-garamond",
};

const PAPER_SIZES: { id: ResumePaperSize; label: string; sub: string }[] = [
  { id: "A4", label: "A4", sub: "210 × 297 mm" },
  { id: "letter", label: "US Letter", sub: '8.5" × 11"' },
];

/**
 * Plain (non-accordion) panel that exposes visual settings.
 * Designed to live inside a tab — see ResumeForm for the integration.
 */
export function VisualSettingsPanel({
  content,
  updateStyle,
}: VisualSettingsPanelProps) {
  const currentFont = (content.style?.fontFamily ?? "Inter") as string;
  const currentTemplate = (content.style?.templateId ?? "classic") as ResumeTemplateId;
  const currentPaper = (content.style?.paperSize ?? "A4") as ResumePaperSize;
  const currentSize = content.style?.fontSize ?? "text-[11px]";
  const currentLineHeight = content.style?.lineHeight ?? "relaxed";
  const currentLanguage = content.style?.language ?? "id";
  const uppercaseHeaders = content.style?.uppercaseHeaders ?? (currentTemplate !== "minimal");

  return (
    <div className="space-y-8">
      {/* Template */}
      <section className="space-y-3">
        <Label className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
          <LayoutTemplate className="h-3.5 w-3.5" />
          Template Resume
        </Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {TEMPLATE_LIST.map((tpl) => {
            const active = currentTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => updateStyle({ templateId: tpl.id })}
                className={`border p-3 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{tpl.label}</span>
                  {active && (
                    <span className="bg-primary text-primary-foreground px-1.5 py-0 text-[9px] font-bold">
                      AKTIF
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-[10px] leading-relaxed">
                  {tpl.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Paper size */}
      <section className="space-y-3">
        <Label className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
          <FileText className="h-3.5 w-3.5" />
          Format Halaman
        </Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {PAPER_SIZES.map((paper) => {
            const active = currentPaper === paper.id;
            return (
              <button
                key={paper.id}
                type="button"
                onClick={() => updateStyle({ paperSize: paper.id })}
                className={`flex items-center justify-between border p-3 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{paper.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-[10px]">
                    {paper.sub}
                  </p>
                </div>
                {active && (
                  <span className="bg-primary text-primary-foreground px-1.5 py-0 text-[9px] font-bold">
                    AKTIF
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-muted-foreground text-[10px] italic">
          A4 dipakai di sebagian besar negara. US Letter umum di Amerika Utara.
        </p>
      </section>

      {/* Font family */}
      <section className="space-y-3">
        <Label className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
          <Type className="h-3.5 w-3.5" />
          Jenis Font
        </Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {RESUME_FONT_FAMILIES.map((font) => {
            const active = currentFont === font;
            return (
              <button
                key={font}
                type="button"
                onClick={() => updateStyle({ fontFamily: font })}
                className={`flex items-center justify-between border p-3 transition-all ${
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <div className="text-left">
                  <p className="text-xs font-bold">{font}</p>
                  <p
                    className={`mt-0.5 text-sm ${FONT_PREVIEW_CLASSES[font]}`}
                  >
                    The quick brown fox.
                  </p>
                </div>
                {active && (
                  <span className="bg-primary text-primary-foreground shrink-0 px-1.5 py-0 text-[9px] font-bold">
                    AKTIF
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Defensively note if user has a legacy font saved. */}
        {!RESUME_FONT_FAMILIES.includes(currentFont as ResumeFontFamily) && (
          <p className="text-amber-600 text-[10px]">
            Font lama &ldquo;{currentFont}&rdquo; akan otomatis dipetakan ke font terdekat.
          </p>
        )}
      </section>

      {/* Font size + Line height */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Ukuran Font
          </Label>
          <div className="flex gap-2">
            {[
              { id: "text-[10px]", label: "Kecil" },
              { id: "text-[11px]", label: "Sedang" },
              { id: "text-[12px]", label: "Besar" },
            ].map((size) => (
              <Button
                key={size.id}
                variant={currentSize === size.id ? "default" : "outline"}
                className="h-9 flex-1 transition-all"
                onClick={() => updateStyle({ fontSize: size.id })}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Jarak Baris
          </Label>
          <div className="flex gap-2">
            {[
              { id: "tight", label: "Rapat" },
              { id: "normal", label: "Normal" },
              { id: "relaxed", label: "Renggang" },
            ].map((line) => (
              <Button
                key={line.id}
                variant={currentLineHeight === line.id ? "default" : "outline"}
                className="h-9 flex-1 transition-all"
                onClick={() => updateStyle({ lineHeight: line.id })}
              >
                {line.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Uppercase headers */}
      <section className="space-y-3">
        <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          Judul Section
        </Label>
        <div className="flex gap-2">
          <Button
            variant={uppercaseHeaders ? "default" : "outline"}
            className="h-9 flex-1 transition-all"
            onClick={() => updateStyle({ uppercaseHeaders: true })}
          >
            UPPERCASE
          </Button>
          <Button
            variant={!uppercaseHeaders ? "default" : "outline"}
            className="h-9 flex-1 transition-all"
            onClick={() => updateStyle({ uppercaseHeaders: false })}
          >
            Normal
          </Button>
        </div>
        <p className="text-muted-foreground text-[10px] italic">
          Berlaku untuk judul section seperti Pengalaman Kerja, Pendidikan, Keahlian, dll.
        </p>
      </section>

      {/* Language */}
      <section className="space-y-3">
        <Label className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
          <Languages className="h-3.5 w-3.5" />
          Bahasa Resume (PDF)
        </Label>
        <div className="flex gap-2">
          {[
            { id: "id", label: "Indonesia" },
            { id: "en", label: "Inggris" },
          ].map((lang) => (
            <Button
              key={lang.id}
              variant={currentLanguage === lang.id ? "default" : "outline"}
              className="h-9 flex-1 transition-all"
              onClick={() => updateStyle({ language: lang.id as "id" | "en" })}
            >
              {lang.label}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground text-[10px] italic">
          Menentukan bahasa label section pada PDF (mis. &ldquo;Pengalaman Kerja&rdquo; vs
          &ldquo;Work Experience&rdquo;).
        </p>
      </section>
    </div>
  );
}
