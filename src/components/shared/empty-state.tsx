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
        "flex flex-col items-center justify-center rounded-none border border-dashed border-border py-20 px-6 text-center animate-in fade-in zoom-in duration-300",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-20 w-20 items-center justify-center border border-dashed border-border bg-muted/30">
          <div className="text-muted-foreground">{icon}</div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
