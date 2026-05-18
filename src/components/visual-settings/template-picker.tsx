"use client";

import { LayoutTemplate } from "lucide-react";

import { SettingsSection } from "./settings-section";

export interface TemplateOption {
  id: string;
  label: string;
  description: string;
}

interface TemplatePickerProps {
  templates: TemplateOption[];
  currentId: string;
  onSelect: (id: string) => void;
  label?: string;
  columns?: 2 | 3;
}

/**
 * Generic template picker grid — works for both resume and cover letter.
 */
export function TemplatePicker({
  templates,
  currentId,
  onSelect,
  label = "Template",
  columns = 3,
}: TemplatePickerProps) {
  return (
    <SettingsSection
      icon={<LayoutTemplate className="h-3.5 w-3.5" />}
      label={label}
    >
      <div className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {templates.map((tpl) => {
          const active = currentId === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
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
    </SettingsSection>
  );
}
