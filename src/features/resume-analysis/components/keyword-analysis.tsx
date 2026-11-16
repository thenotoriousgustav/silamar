"use client";

import type { KeywordAnalysis } from "../types/resume-analyzer-dto";

interface KeywordAnalysisProps {
  data: KeywordAnalysis;
}

export function KeywordAnalysis({ data }: KeywordAnalysisProps) {
  return (
    <div className="border-border space-y-4 border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase">
          🔑 Analisis Keyword
        </h3>
        <span
          className={`text-sm font-bold ${data.score >= 80 ? "text-emerald-500" : data.score >= 60 ? "text-amber-500" : "text-red-500"}`}
        >
          {data.score}%
        </span>
      </div>

      {/* Found Keywords */}
      {data.found.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
            ✓ Keyword Ditemukan
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.found.map((item, i) => (
              <span
                key={i}
                className="border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
              >
                {item.keyword}
                {item.count && item.count > 1 && (
                  <span className="ml-1 opacity-60">×{item.count}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Keywords */}
      {data.suggested.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-primary text-[10px] font-bold tracking-wider uppercase">
            + Disarankan untuk Ditambahkan
          </h4>
          <div className="space-y-1">
            {data.suggested.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className={`shrink-0 px-1.5 py-0 text-[9px] font-bold ${
                    item.priority === "high"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {item.priority === "high" ? "PENTING" : "MEDIUM"}
                </span>
                <span className="text-[11px] font-medium">{item.keyword}</span>
                {item.reason && (
                  <span className="text-muted-foreground text-[10px]">
                    — {item.reason}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overused Keywords */}
      {data.overused.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold tracking-wider text-amber-600 uppercase">
            ⚠️ Terlalu Umum / Berlebihan
          </h4>
          <div className="space-y-1">
            {data.overused.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-[10px]">
                <span className="shrink-0 bg-amber-500/10 px-1.5 py-0 font-bold text-amber-700">
                  {item.keyword}
                </span>
                {item.reason && (
                  <span className="text-muted-foreground">{item.reason}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
