"use client";

import { CheckCircle2 } from "lucide-react";

interface AnalyzerStrengthsProps {
  data: string[];
}

export function AnalyzerStrengths({ data }: AnalyzerStrengthsProps) {
  if (data.length === 0) return null;

  return (
    <div className="border-border space-y-3 border p-5">
      <h3 className="text-xs font-bold tracking-wider uppercase">
        💪 Kekuatan Resume
      </h3>
      <ul className="space-y-2">
        {data.map((strength, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px]">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span className="text-muted-foreground">{strength}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
