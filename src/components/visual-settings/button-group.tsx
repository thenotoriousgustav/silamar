"use client";

import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";

export interface ButtonGroupOption {
  id: string;
  label: string;
}

interface ButtonGroupProps {
  label: string;
  options: ButtonGroupOption[];
  currentId: string;
  onSelect: (id: string) => void;
  hint?: string;
}

/**
 * A row of toggle buttons for selecting one option from a small set.
 * Used for font size, line height, density, language, etc.
 */
export function ButtonGroup({
  label,
  options,
  currentId,
  onSelect,
  hint,
}: ButtonGroupProps) {
  return (
    <SettingsSection label={label} hint={hint}>
      <div className="flex gap-2">
        {options.map((opt) => (
          <Button
            key={opt.id}
            variant={currentId === opt.id ? "default" : "outline"}
            className="h-9 flex-1 transition-all"
            onClick={() => onSelect(opt.id)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </SettingsSection>
  );
}
