"use client";

import { AlertTriangle } from "lucide-react";

import type { RedFlag } from "../types/resume-analyzer-dto";

interface AnalyzerRedFlagsProps {
  data: RedFlag[];
  onHighlight?: (text: string | null) => void;
}

export function AnalyzerRedFlags({ data, onHighlight }: AnalyzerRedFlagsProps) {
  if (data.length === 0) return null;

  const severityConfig = {
    high: {
      bg: "bg-red-500/5 border-red-500/20 hover:bg-red-500/10",
      icon: "text-red-500",
      label: "TINGGI",
      labelBg: "bg-red-500/10 text-red-600",
    },
    medium: {
      bg: "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10",
      icon: "text-amber-500",
      label: "SEDANG",
      labelBg: "bg-amber-500/10 text-amber-600",
    },
    low: {
      bg: "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10",
      icon: "text-blue-500",
      label: "RENDAH",
      labelBg: "bg-blue-500/10 text-blue-600",
    },
  };

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
          const config = severityConfig[flag.severity];
          return (
            <button
              key={i}
              type="button"
              className={`w-full border p-3 text-left transition-colors ${config.bg}`}
              onClick={() => {
                if (flag.highlightText) {
                  onHighlight?.(flag.highlightText);
                }
              }}
              onMouseLeave={() => onHighlight?.(null)}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${config.icon}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold">{flag.title}</span>
                    <span
                      className={`px-1 py-0 text-[8px] font-bold ${config.labelBg}`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[10px]">
                    {flag.description}
                  </p>
                  <p className="text-primary mt-1 text-[10px] font-medium">
                    💡 {flag.suggestion}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
