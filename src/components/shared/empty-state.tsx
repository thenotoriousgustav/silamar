"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border animate-in fade-in zoom-in flex flex-col items-center justify-center rounded-none border border-dashed px-6 py-20 text-center duration-300",
        className,
      )}
    >
      {icon && (
        <div className="border-border bg-muted/30 mb-4 flex h-20 w-20 items-center justify-center border border-dashed">
          <div className="text-muted-foreground">{icon}</div>
        </div>
      )}
      <h3 className="text-foreground text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-xs text-sm">
        {description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
