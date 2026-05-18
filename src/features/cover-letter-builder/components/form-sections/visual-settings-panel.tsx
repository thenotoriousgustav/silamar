"use client";

import { FileText, Languages } from "lucide-react";

import {
  ButtonGroup,
  FontPicker,
  SettingsSection,
  TemplatePicker,
} from "@/components/visual-settings";
import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";
import { COVER_LETTER_FONT_FAMILIES } from "@/types/cover-letter";

import { TEMPLATE_LIST } from "../../templates/registry";

interface VisualSettingsPanelProps {
  content: CoverLetterBuilderData;
  updateStyle: (style: Partial<CoverLetterBuilderData["style"]>) => void;
}

const PAPER_SIZES = [
  { id: "A4", label: "A4", sub: "210 × 297 mm" },
  { id: "letter", label: "US Letter", sub: '8.5" × 11"' },
] as const;

export function VisualSettingsPanel({
  content,
  updateStyle,
}: VisualSettingsPanelProps) {
  const currentFont = content.style?.fontFamily ?? "Inter";
  const currentTemplate = content.style?.templateId ?? "classic";
  const currentSize = content.style?.fontSize ?? "11px";
  const currentLineHeight = content.style?.lineHeight ?? "relaxed";
  const currentDensity = content.style?.density ?? "normal";
  const currentLanguage = content.style?.language ?? "id";
  const currentPaper = content.style?.paperSize ?? "A4";
  const uppercaseHeaders = content.style?.uppercaseHeaders ?? false;

  return (
    <div className="space-y-8">
      {/* Template */}
      <TemplatePicker
        label="Template Visual"
        templates={TEMPLATE_LIST}
        currentId={currentTemplate}
        onSelect={(id) =>
          updateStyle({ templateId: id as CoverLetterBuilderData["style"]["templateId"] })
        }
        columns={3}
      />

      {/* Paper size */}
      <SettingsSection
        icon={<FileText className="h-3.5 w-3.5" />}
        label="Format Halaman"
        hint="A4 dipakai di sebagian besar negara. US Letter umum di Amerika Utara."
      >
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
      </SettingsSection>

      {/* Font family — only Inter, Roboto, Garamond */}
      <FontPicker
        fonts={COVER_LETTER_FONT_FAMILIES.map((f) => ({ id: f, label: f }))}
        currentFont={currentFont}
        onSelect={(f) => updateStyle({ fontFamily: f })}
      />

      {/* Font size + Line height + Density */}
      <section className="grid gap-6 md:grid-cols-3">
        <ButtonGroup
          label="Ukuran Font"
          options={[
            { id: "10px", label: "Kecil" },
            { id: "11px", label: "Sedang" },
            { id: "12px", label: "Besar" },
          ]}
          currentId={currentSize}
          onSelect={(id) => updateStyle({ fontSize: id })}
        />
        <ButtonGroup
          label="Jarak Baris"
          options={[
            { id: "tight", label: "Rapat" },
            { id: "normal", label: "Normal" },
            { id: "relaxed", label: "Renggang" },
          ]}
          currentId={currentLineHeight}
          onSelect={(id) => updateStyle({ lineHeight: id })}
        />
        <ButtonGroup
          label="Kepadatan"
          options={[
            { id: "compact", label: "Padat" },
            { id: "normal", label: "Normal" },
            { id: "comfortable", label: "Longgar" },
          ]}
          currentId={currentDensity}
          onSelect={(id) =>
            updateStyle({ density: id as "compact" | "normal" | "comfortable" })
          }
        />
      </section>

      {/* Uppercase headers */}
      <ButtonGroup
        label="Judul Section"
        options={[
          { id: "true", label: "UPPERCASE" },
          { id: "false", label: "Normal" },
        ]}
        currentId={String(uppercaseHeaders)}
        onSelect={(id) => updateStyle({ uppercaseHeaders: id === "true" })}
        hint="Berlaku untuk judul Perihal dan label lainnya."
      />

      {/* Language */}
      <ButtonGroup
        label="Bahasa (PDF)"
        options={[
          { id: "id", label: "Indonesia" },
          { id: "en", label: "Inggris" },
        ]}
        currentId={currentLanguage}
        onSelect={(id) => updateStyle({ language: id as "id" | "en" })}
        hint='Menentukan bahasa label pada PDF (mis. "Perihal" vs "Subject").'
      />
    </div>
  );
}
