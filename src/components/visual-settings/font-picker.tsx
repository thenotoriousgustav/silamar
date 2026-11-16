"use client";

import { Type } from "lucide-react";

import { SettingsSection } from "./settings-section";

export interface FontOption {
  id: string;
  label: string;
  /** Optional Tailwind class to preview the font in the button. */
  previewClass?: string;
}

interface FontPickerProps {
  fonts: FontOption[];
  currentFont: string;
  onSelect: (font: string) => void;
  legacyFontWarning?: string;
}

/**
 * Font family picker — shows font name with optional live preview text.
 */
export function FontPicker({
  fonts,
  currentFont,
  onSelect,
  legacyFontWarning,
}: FontPickerProps) {
  return (
    <SettingsSection icon={<Type className="h-3.5 w-3.5" />} label="Jenis Font">
      <div className="grid gap-2 sm:grid-cols-2">
        {fonts.map((font) => {
          const active = currentFont === font.id;
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => onSelect(font.id)}
              className={`flex items-center justify-between border p-3 transition-all ${
                active
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-muted/30"
              }`}
            >
              <div className="text-left">
                <p className="text-xs font-bold">{font.label}</p>
                {font.previewClass && (
                  <p className={`mt-0.5 text-sm ${font.previewClass}`}>
                    The quick brown fox.
                  </p>
                )}
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
      {legacyFontWarning && (
        <p className="text-[10px] text-amber-600">{legacyFontWarning}</p>
      )}
    </SettingsSection>
  );
}
