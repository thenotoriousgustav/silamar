"use client";

import { Sparkles, TrendingUp } from "lucide-react";

import type { JobFitDTO } from "../../schemas/job-fit";

interface JobFitApplyStrategyProps {
  data: JobFitDTO["applyStrategy"];
  shouldApply: boolean;
}

const chanceLabel: Record<JobFitDTO["applyStrategy"]["chanceOfInterview"], string> = {
  very_high: "Sangat Tinggi",
  high: "Tinggi",
  moderate: "Sedang",
  low: "Rendah",
  very_low: "Sangat Rendah",
};

const chanceBg: Record<JobFitDTO["applyStrategy"]["chanceOfInterview"], string> = {
  very_high: "bg-emerald-500/10 text-emerald-600",
  high: "bg-emerald-500/10 text-emerald-600",
  moderate: "bg-amber-500/10 text-amber-600",
  low: "bg-orange-500/10 text-orange-600",
  very_low: "bg-red-500/10 text-red-600",
};

const customizationLabel: Record<
  JobFitDTO["applyStrategy"]["customizationNeeded"],
  string
> = {
  minimal: "Sedikit Penyesuaian",
  moderate: "Sedang",
  significant: "Banyak Perbaikan",
  complete_rewrite: "Tulis Ulang",
};

const customizationBg: Record<
  JobFitDTO["applyStrategy"]["customizationNeeded"],
  string
> = {
  minimal: "bg-emerald-500/10 text-emerald-600",
  moderate: "bg-amber-500/10 text-amber-600",
  significant: "bg-orange-500/10 text-orange-600",
  complete_rewrite: "bg-red-500/10 text-red-600",
};

export function JobFitApplyStrategy({
  data,
  shouldApply,
}: JobFitApplyStrategyProps) {
  return (
    <div className="border-border space-y-4 border p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary h-3.5 w-3.5" />
        <h3 className="text-xs font-bold tracking-wider uppercase">
          Strategi Apply
        </h3>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border-border/60 border p-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
              Peluang Interview
            </span>
          </div>
          <span
            className={`mt-1.5 inline-block px-2 py-0.5 text-[10px] font-bold ${chanceBg[data.chanceOfInterview]}`}
          >
            {chanceLabel[data.chanceOfInterview]}
          </span>
        </div>
        <div className="border-border/60 border p-3">
          <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
            Penyesuaian Resume
          </span>
          <span
            className={`mt-1.5 inline-block px-2 py-0.5 text-[10px] font-bold ${customizationBg[data.customizationNeeded]}`}
          >
            {customizationLabel[data.customizationNeeded]}
          </span>
        </div>
      </div>

      {/* Resume edits */}
      {data.resumeEdits.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold tracking-wider uppercase">
            Saran Edit Resume
          </h4>
          <ul className="space-y-1">
            {data.resumeEdits.map((edit, i) => (
              <li
                key={i}
                className="border-l-2 border-primary/30 bg-muted/30 px-2.5 py-1.5 text-[11px] leading-relaxed"
              >
                {edit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cover letter angle */}
      {shouldApply && data.coverLetterAngle && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold tracking-wider uppercase">
            Sudut Pandang Cover Letter
          </h4>
          <p className="border-primary/30 bg-primary/5 border-l-2 px-2.5 py-1.5 text-[11px] leading-relaxed">
            {data.coverLetterAngle}
          </p>
        </div>
      )}
    </div>
  );
}
