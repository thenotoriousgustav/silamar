"use client";

import type { JobFitDTO } from "../../schemas/job-fit";

interface JobFitKeywordsProps {
  data: JobFitDTO["keywordMatch"];
}

export function JobFitKeywords({ data }: JobFitKeywordsProps) {
  const scoreColor =
    data.score >= 70
      ? "text-emerald-500"
      : data.score >= 40
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div className="border-border space-y-4 border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase">
          🔑 Kecocokan Keyword
        </h3>
        <span className={`text-sm font-bold ${scoreColor}`}>{data.score}%</span>
      </div>

      {data.matched.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold tracking-wider uppercase text-emerald-600">
            ✓ Cocok ({data.matched.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.matched.map((k, i) => (
              <span
                key={i}
                className="bg-emerald-500/10 border-emerald-500/20 border px-2 py-0.5 text-[10px] font-medium text-emerald-700"
              >
                {k.keyword}
                {k.frequency > 1 && (
                  <span className="ml-1 opacity-60">×{k.frequency}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.missingCritical.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold tracking-wider uppercase text-red-600">
            ✗ Hilang (Kritis)
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.missingCritical.map((k, i) => (
              <span
                key={i}
                className="bg-red-500/10 border-red-500/20 border px-2 py-0.5 text-[10px] font-medium text-red-700"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.missingNiceToHave.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold tracking-wider uppercase text-amber-600">
            ◌ Hilang (Nice to Have)
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.missingNiceToHave.map((k, i) => (
              <span
                key={i}
                className="bg-amber-500/10 border-amber-500/20 border px-2 py-0.5 text-[10px] font-medium text-amber-700"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
