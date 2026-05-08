"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CreditBadgeProps {
  credits?: number;
  className?: string;
}

export function CreditBadge({ credits = 0, className }: CreditBadgeProps) {
  return (
    <div
      className={cn(
        "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 flex cursor-default items-center gap-1.5 rounded-none border px-2.5 py-1 text-xs font-bold transition-all",
        className,
      )}
    >
      <Zap className="h-3 w-3 fill-current" />
      <span>{credits} KREDIT</span>
    </div>
  );
}
