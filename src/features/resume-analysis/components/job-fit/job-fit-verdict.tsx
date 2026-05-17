"use client";

import { CheckCircle2, ShieldAlert, ShieldX, ThumbsUp, Zap } from "lucide-react";

import type { JobFitDTO } from "../../schemas/job-fit";

interface JobFitVerdictProps {
  data: JobFitDTO;
}

const decisionConfig: Record<
  JobFitDTO["verdict"]["decision"],
  {
    icon: typeof CheckCircle2;
    accent: string;
    bg: string;
    border: string;
    label: string;
    pillBg: string;
  }
> = {
  strong_fit: {
    icon: Zap,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/30",
    label: "SANGAT COCOK",
    pillBg: "bg-emerald-500/10 text-emerald-600",
  },
  good_fit: {
    icon: ThumbsUp,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/30",
    label: "COCOK",
    pillBg: "bg-emerald-500/10 text-emerald-600",
  },
  stretch: {
    icon: CheckCircle2,
    accent: "text-amber-500",
    bg: "bg-amber-500/5",
    border: "border-amber-500/30",
    label: "STRETCH",
    pillBg: "bg-amber-500/10 text-amber-600",
  },
  poor_fit: {
    icon: ShieldAlert,
    accent: "text-orange-500",
    bg: "bg-orange-500/5",
    border: "border-orange-500/30",
    label: "KURANG COCOK",
    pillBg: "bg-orange-500/10 text-orange-600",
  },
  not_fit: {
    icon: ShieldX,
    accent: "text-red-500",
    bg: "bg-red-500/5",
    border: "border-red-500/30",
    label: "TIDAK COCOK",
    pillBg: "bg-red-500/10 text-red-600",
  },
};

export function JobFitVerdict({ data }: JobFitVerdictProps) {
  const cfg = decisionConfig[data.verdict.decision];
  const Icon = cfg.icon;

  return (
    <div className={`border ${cfg.border} ${cfg.bg} space-y-4 p-5`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center ${cfg.pillBg}`}
        >
          <Icon className={`h-5 w-5 ${cfg.accent}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 text-[10px] font-bold ${cfg.pillBg}`}>
              {cfg.label}
            </span>
            <span className="bg-muted text-muted-foreground px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
              Keyakinan: {data.verdict.confidence}
            </span>
            <span
              className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                data.verdict.shouldApply
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-red-500/10 text-red-600"
              }`}
            >
              {data.verdict.shouldApply ? "Direkomendasikan apply" : "Sebaiknya tidak apply"}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold">{data.verdict.label}</h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {data.verdict.summary}
          </p>
        </div>
      </div>

      {/* Score bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            Skor Kecocokan
          </span>
          <span className={`text-2xl font-black tracking-tighter ${cfg.accent}`}>
            {data.matchScore}
            <span className="text-muted-foreground text-xs">/100</span>
          </span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              data.matchScore >= 70
                ? "bg-emerald-500"
                : data.matchScore >= 40
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${data.matchScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
