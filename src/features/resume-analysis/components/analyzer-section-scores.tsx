"use client";

import type { SectionScoreItem } from "../types/resume-analyzer-dto";

interface AnalyzerSectionScoresProps {
  data: SectionScoreItem[];
}

const statusLabels: Record<string, string> = {
  excellent: "Luar Biasa",
  good: "Baik",
  needs_work: "Perlu Perbaikan",
  poor: "Kurang",
};

export function AnalyzerSectionScores({ data }: AnalyzerSectionScoresProps) {
  const scoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="border-border space-y-4 border p-5">
      <h3 className="text-xs font-bold tracking-wider uppercase">
        📋 Skor per Section
      </h3>

      <div className="space-y-3">
        {data.map((section, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold">{section.section}</span>
                <span
                  className={`px-1.5 py-0 text-[9px] font-bold ${
                    section.status === "excellent"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : section.status === "good"
                        ? "bg-blue-500/10 text-blue-600"
                        : section.status === "needs_work"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {statusLabels[section.status]}
                </span>
              </div>
              <span
                className={`text-xs font-bold ${scoreColor(section.score)}`}
              >
                {section.score}%
              </span>
            </div>

            <div className="bg-muted h-1.5 w-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${scoreBg(section.score)}`}
                style={{ width: `${section.score}%` }}
              />
            </div>

            <p className="text-muted-foreground text-[10px]">
              {section.feedback}
            </p>

            {section.missing && section.missing.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {section.missing.map((item, j) => (
                  <span
                    key={j}
                    className="bg-red-500/5 border-red-500/10 border px-1.5 py-0 text-[9px] text-red-600"
                  >
                    ✗ {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
