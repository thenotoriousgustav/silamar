"use client";

import { Label } from "@/components/ui/label";

interface FormFieldLabelProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Consistent form field label with optional icon.
 * Extracts the repeated label styling pattern used across form components.
 */
export function FormFieldLabel({ icon, children }: FormFieldLabelProps) {
  return (
    <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
      {icon}
      {children}
    </Label>
  );
}
