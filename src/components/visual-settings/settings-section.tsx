"use client";

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

interface SettingsSectionProps {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
  hint?: string;
}

/**
 * Reusable section wrapper for visual settings panels.
 * Renders a labelled section with optional hint text below.
 */
export function SettingsSection({
  icon,
  label,
  children,
  hint,
}: SettingsSectionProps) {
  return (
    <section className="space-y-3">
      <Label className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
        {icon}
        {label}
      </Label>
      {children}
      {hint && (
        <p className="text-muted-foreground text-[10px] italic">{hint}</p>
      )}
    </section>
  );
}
