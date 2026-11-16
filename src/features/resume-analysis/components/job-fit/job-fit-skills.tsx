"use client";

import { Check, Minus, X } from "lucide-react";

import type { JobFitDTO } from "../../schemas/job-fit";

interface JobFitSkillsProps {
  data: JobFitDTO["skillsAnalysis"];
}

const importanceLabel = {
  must_have: "WAJIB",
  nice_to_have: "PLUS",
} as const;

const importanceBg = {
  must_have: "bg-red-500/10 text-red-600",
  nice_to_have: "bg-blue-500/10 text-blue-600",
} as const;

const applicabilityBg = {
  high: "bg-emerald-500/10 text-emerald-600",
  medium: "bg-amber-500/10 text-amber-600",
  low: "bg-muted text-muted-foreground",
} as const;

export function JobFitSkills({ data }: JobFitSkillsProps) {
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
          🎯 Analisis Skill
        </h3>
        <span className={`text-sm font-bold ${scoreColor}`}>{data.score}%</span>
      </div>

      {/* Matched */}
      {data.matched.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
            ✓ Skill Cocok ({data.matched.length})
          </h4>
          <ul className="space-y-1.5">
            {data.matched.map((m, i) => (
              <li
                key={i}
                className="flex items-start gap-2 border border-emerald-500/20 bg-emerald-500/5 p-2"
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold">{m.skill}</span>
                    <span
                      className={`px-1 py-0 text-[8px] font-bold ${importanceBg[m.importance]}`}
                    >
                      {importanceLabel[m.importance]}
                    </span>
                  </div>
                  {m.evidence && (
                    <p className="text-muted-foreground mt-0.5 text-[10px] italic">
                      &ldquo;{m.evidence}&rdquo;
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Missing */}
      {data.missing.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-[10px] font-bold tracking-wider text-red-600 uppercase">
            ✗ Skill Belum Ada ({data.missing.length})
          </h4>
          <ul className="space-y-1.5">
            {data.missing.map((m, i) => (
              <li
                key={i}
                className="flex items-start gap-2 border border-red-500/20 bg-red-500/5 p-2"
              >
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold">{m.skill}</span>
                    <span
                      className={`px-1 py-0 text-[8px] font-bold ${importanceBg[m.importance]}`}
                    >
                      {importanceLabel[m.importance]}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[10px]">
                    {m.impact}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Transferable */}
      {data.transferable.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-[10px] font-bold tracking-wider text-amber-600 uppercase">
            ↪ Skill Transferable ({data.transferable.length})
          </h4>
          <ul className="space-y-1.5">
            {data.transferable.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2 border border-amber-500/20 bg-amber-500/5 p-2"
              >
                <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold">{t.skill}</span>
                    <span className="text-muted-foreground text-[10px]">→</span>
                    <span className="text-[11px]">{t.appliesTo}</span>
                    <span
                      className={`px-1 py-0 text-[8px] font-bold ${applicabilityBg[t.applicability]}`}
                    >
                      {t.applicability.toUpperCase()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
