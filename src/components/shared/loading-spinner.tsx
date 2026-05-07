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
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 
        className="animate-spin text-primary" 
        style={{ width: size, height: size }} 
      />
      {label && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}

export function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <LoadingSpinner size={40} label={label} />
    </div>
  );
}
