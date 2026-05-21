"use client";

import { ArrowRight } from "lucide-react";

import type { ContentQuality } from "../types/resume-analyzer-dto";

interface ContentQualityProps {
  data: ContentQuality;
}

export function ContentQuality({ data }: ContentQualityProps) {
  return (
    <div className="border-border space-y-4 border p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase">
          ✍️ Kualitas Konten
        </h3>
        <span
          className={`text-sm font-bold ${data.score >= 80 ? "text-emerald-500" : data.score >= 60 ? "text-amber-500" : "text-red-500"}`}
        >
          {data.score}%
        </span>
      </div>

      {/* Bullet Points Analysis */}
      <div className="bg-muted/30 space-y-2 p-3">
        <h4 className="text-[10px] font-bold tracking-wider uppercase">
          Bullet Points
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Total" value={data.bulletPoints.total} />
          <Stat
            label="Action Verb"
            value={data.bulletPoints.withActionVerb}
            total={data.bulletPoints.total}
            good
          />
          <Stat
            label="Dengan Metric"
            value={data.bulletPoints.withMetric}
            total={data.bulletPoints.total}
            good
          />
          <Stat label="Terlalu Pendek" value={data.bulletPoints.tooShort} bad />
        </div>
        <p className="text-muted-foreground text-[10px]">
          {data.bulletPoints.feedback}
        </p>

        {data.bulletPoints.examples && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[9px] font-bold tracking-wider uppercase">
              Contoh Perbaikan:
            </p>
            <div className="flex items-center gap-2">
              <span className="flex-1 border border-red-500/20 bg-red-500/5 p-2 text-[10px] text-red-700 line-through">
                {data.bulletPoints.examples.before}
              </span>
              <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
              <span className="flex-1 border border-emerald-500/20 bg-emerald-500/5 p-2 text-[10px] text-emerald-700">
                {data.bulletPoints.examples.after}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Verbs */}
      <div className="bg-muted/30 space-y-2 p-3">
        <h4 className="text-[10px] font-bold tracking-wider uppercase">
          Action Verbs
        </h4>
        <div className="flex flex-wrap gap-1">
          {data.actionVerbs.found.map((v, i) => (
            <span
              key={i}
              className="bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700"
            >
              ✓ {v}
            </span>
          ))}
          {data.actionVerbs.weak.map((v, i) => (
            <span
              key={`w-${i}`}
              className="bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-700"
            >
              ✗ {v}
            </span>
          ))}
        </div>
        {data.actionVerbs.suggestions.length > 0 && (
          <div className="pt-1">
            <p className="text-[9px] font-bold tracking-wider uppercase">
              Disarankan:
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {data.actionVerbs.suggestions.map((v, i) => (
                <span
                  key={i}
                  className="bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Writing Quality */}
      <div className="bg-muted/30 space-y-2 p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold tracking-wider uppercase">
            Kualitas Penulisan
          </h4>
          <span className="text-[10px] font-bold">
            {data.writingQuality.score}%
          </span>
        </div>
        {data.writingQuality.typosFound > 0 && (
          <p className="text-[10px] text-amber-600">
            ⚠️ Ditemukan {data.writingQuality.typosFound} typo
          </p>
        )}
        {data.writingQuality.issues.map((issue, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            <span className="text-red-600 line-through">{issue.text}</span>
            <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
            <span className="font-medium text-emerald-600">
              {issue.suggestion}
            </span>
          </div>
        ))}
      </div>

      {/* Length */}
      <div className="text-muted-foreground text-[10px]">
        📄 {data.length.pageCount} halaman · {data.length.wordCount} kata ·{" "}
        <span
          className={
            data.length.status === "good"
              ? "text-emerald-500"
              : "text-amber-500"
          }
        >
          {data.length.feedback}
        </span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  total,
  good,
  bad,
}: {
  label: string;
  value: number;
  total?: number;
  good?: boolean;
  bad?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-bold ${
          bad && value > 0 ? "text-red-500" : good ? "text-emerald-500" : ""
        }`}
      >
        {value}
        {total ? `/${total}` : ""}
      </span>
    </div>
  );
}
