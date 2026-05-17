"use client";

import { ArrowRight } from "lucide-react";

import type { JobFitDTO } from "../../schemas/job-fit";

interface JobFitRecommendationsProps {
  data: JobFitDTO["recommendations"];
}

const priorityBg = (p: number) => {
  if (p === 1) return "bg-red-500 text-white";
  if (p === 2) return "bg-orange-500 text-white";
  if (p === 3) return "bg-amber-500 text-white";
  return "bg-muted text-muted-foreground";
};

export function JobFitRecommendations({ data }: JobFitRecommendationsProps) {
  if (data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.priority - b.priority);

  return (
    <div className="border-border space-y-3 border p-5">
      <h3 className="text-xs font-bold tracking-wider uppercase">
        📋 Rekomendasi Tindakan
      </h3>

      <ol className="space-y-2">
        {sorted.map((item, i) => (
          <li
            key={i}
            className="border-border/60 flex items-start gap-3 border p-3"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-black ${priorityBg(item.priority)}`}
              title={`Prioritas ${item.priority}`}
            >
              {item.priority}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[12px] font-bold leading-snug">
                {item.action}
              </p>
              <p className="text-muted-foreground flex items-start gap-1 text-[10px] leading-relaxed">
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" />
                {item.rationale}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
