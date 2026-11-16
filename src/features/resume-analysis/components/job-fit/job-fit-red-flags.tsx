"use client";

import { AlertOctagon, AlertTriangle } from "lucide-react";

import type { JobFitDTO } from "../../schemas/job-fit";

interface JobFitRedFlagsProps {
  data: JobFitDTO["redFlags"];
}

const severityConfig = {
  blocking: {
    bg: "bg-red-500/10 border-red-500/40",
    icon: "text-red-600",
    Icon: AlertOctagon,
    label: "BLOCKING",
    labelBg: "bg-red-500/20 text-red-700",
  },
  high: {
    bg: "bg-red-500/5 border-red-500/20",
    icon: "text-red-500",
    Icon: AlertTriangle,
    label: "TINGGI",
    labelBg: "bg-red-500/10 text-red-600",
  },
  medium: {
    bg: "bg-amber-500/5 border-amber-500/20",
    icon: "text-amber-500",
    Icon: AlertTriangle,
    label: "SEDANG",
    labelBg: "bg-amber-500/10 text-amber-600",
  },
  low: {
    bg: "bg-blue-500/5 border-blue-500/20",
    icon: "text-blue-500",
    Icon: AlertTriangle,
    label: "RENDAH",
    labelBg: "bg-blue-500/10 text-blue-600",
  },
} as const;

export function JobFitRedFlags({ data }: JobFitRedFlagsProps) {
  if (data.length === 0) return null;

  return (
    <div className="border-border space-y-4 border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase">
          🚩 Red Flags
        </h3>
        <span className="bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">
          {data.length} ditemukan
        </span>
      </div>

      <div className="space-y-2">
        {data.map((flag, i) => {
          const cfg = severityConfig[flag.severity];
          const Icon = cfg.Icon;
          return (
            <div key={i} className={`border p-3 ${cfg.bg}`}>
              <div className="flex items-start gap-2">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.icon}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold">{flag.title}</span>
                    <span
                      className={`px-1 py-0 text-[8px] font-bold ${cfg.labelBg}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[10px] leading-relaxed">
                    {flag.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
