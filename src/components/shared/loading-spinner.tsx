"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function LoadingSpinner({
  className,
  size = 24,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Loader2
        className="text-primary animate-spin"
        style={{ width: size, height: size }}
      />
      {label && (
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          {label}
        </p>
      )}
    </div>
  );
}

export function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div className="bg-background/80 animate-in fade-in fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm duration-300">
      <LoadingSpinner size={40} label={label} />
    </div>
  );
}
