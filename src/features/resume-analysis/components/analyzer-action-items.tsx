"use client";

import { Clock, Zap } from "lucide-react";

import type { ActionItem } from "../types/resume-analyzer-dto";

interface AnalyzerActionItemsProps {
  data: ActionItem[];
}

export function AnalyzerActionItems({ data }: AnalyzerActionItemsProps) {
  if (data.length === 0) return null;

  const impactColor = {
    high: "text-red-600 bg-red-500/10",
    medium: "text-amber-600 bg-amber-500/10",
    low: "text-blue-600 bg-blue-500/10",
  };

  const effortColor = {
    low: "text-emerald-600 bg-emerald-500/10",
    medium: "text-amber-600 bg-amber-500/10",
    high: "text-red-600 bg-red-500/10",
  };

  return (
    <div className="border-border space-y-4 border p-5">
      <h3 className="text-xs font-bold tracking-wider uppercase">
        🎯 Action Items Prioritas
      </h3>

      <div className="space-y-2">
        {data
          .sort((a, b) => a.priority - b.priority)
          .map((item, i) => (
            <div
              key={i}
              className="bg-muted/20 flex items-start gap-3 border p-3"
            >
              <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-black">
                {item.priority}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold">{item.title}</p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {item.description}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 px-1.5 py-0 text-[8px] font-bold ${impactColor[item.impact]}`}
                  >
                    <Zap className="h-2.5 w-2.5" />
                    Impact: {item.impact}
                  </span>
                  <span
                    className={`px-1.5 py-0 text-[8px] font-bold ${effortColor[item.effort]}`}
                  >
                    Effort: {item.effort}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-[9px]">
                    <Clock className="h-2.5 w-2.5" />
                    {item.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
