"use client";

import type { OverallScore } from "../types/resume-analyzer-dto";

interface OverallScoreProps {
  data: OverallScore;
}

export function OverallScore({ data }: OverallScoreProps) {
  const scoreColor =
    data.total >= 80
      ? "text-emerald-500"
      : data.total >= 60
        ? "text-amber-500"
        : "text-red-500";

  const scoreBg =
    data.total >= 80
      ? "bg-emerald-500"
      : data.total >= 60
        ? "bg-amber-500"
        : "bg-red-500";

  const gradeBg =
    data.total >= 80
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      : data.total >= 60
        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
        : "bg-red-500/10 text-red-600 border-red-500/20";

  return (
    <div className="border-border space-y-4 border p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold tracking-wider uppercase">
            Skor Keseluruhan
          </h3>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {data.label}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`border px-3 py-1 text-sm font-black tracking-tighter ${gradeBg}`}
          >
            {data.grade}
          </span>
          <span className={`text-4xl font-black tracking-tighter ${scoreColor}`}>
            {data.total}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="bg-muted h-2 w-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out ${scoreBg}`}
          style={{ width: `${data.total}%` }}
        />
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">
        {data.summary}
      </p>
    </div>
  );
}
