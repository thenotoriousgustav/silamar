"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import type { ATSCompatibility } from "../types/resume-analyzer-dto";

interface ATSCompatibilityProps {
  data: ATSCompatibility;
}

export function ATSCompatibility({ data }: ATSCompatibilityProps) {
  const statusIcon = {
    pass: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    fail: <XCircle className="h-4 w-4 text-red-500" />,
  };

  const statusBg = {
    pass: "bg-emerald-500/5 border-emerald-500/10",
    warning: "bg-amber-500/5 border-amber-500/10",
    fail: "bg-red-500/5 border-red-500/10",
  };

  return (
    <div className="border-border space-y-4 border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase">
          🤖 Kompatibilitas ATS
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${data.score >= 80 ? "text-emerald-500" : data.score >= 60 ? "text-amber-500" : "text-red-500"}`}
          >
            {data.score}%
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold ${
              data.passed
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            {data.passed ? "PASSED" : "FAILED"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {data.checks.map((check, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 border p-3 ${statusBg[check.status]}`}
          >
            <div className="mt-0.5 shrink-0">{statusIcon[check.status]}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold">{check.category}</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                {check.message}
              </p>
              {check.suggestion && (
                <p className="text-primary mt-1 text-[10px] font-medium">
                  💡 {check.suggestion}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
