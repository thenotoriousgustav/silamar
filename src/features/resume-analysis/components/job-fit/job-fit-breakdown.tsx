"use client";

import { Briefcase, Building2, Users } from "lucide-react";

import type { JobFitDTO } from "../../schemas/job-fit";

const seniorityLabel: Record<
  JobFitDTO["roleAlignment"]["seniorityMatch"],
  string
> = {
  match: "Sesuai",
  underqualified: "Kurang Pengalaman",
  overqualified: "Overqualified",
  unclear: "Tidak Jelas",
};

const seniorityBg: Record<
  JobFitDTO["roleAlignment"]["seniorityMatch"],
  string
> = {
  match: "bg-emerald-500/10 text-emerald-600",
  underqualified: "bg-red-500/10 text-red-600",
  overqualified: "bg-amber-500/10 text-amber-600",
  unclear: "bg-muted text-muted-foreground",
};

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-emerald-500"
      : score >= 40
        ? "text-amber-500"
        : "text-red-500";
  return <span className={`text-sm font-bold ${color}`}>{score}%</span>;
}

function MiniBar({ value }: { value: number }) {
  const bg =
    value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="bg-muted h-1.5 w-full overflow-hidden">
      <div
        className={`h-full transition-all duration-700 ${bg}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

interface JobFitBreakdownProps {
  data: JobFitDTO;
}

/**
 * Renders the three foundational alignment cards: domain, role, experience.
 * These are the highest-signal sections — they answer "is this even the right
 * job for me?" before drilling into skills/keywords.
 */
export function JobFitBreakdown({ data }: JobFitBreakdownProps) {
  const { domainAlignment, roleAlignment, experienceAlignment } = data;

  return (
    <div className="space-y-3">
      {/* Domain alignment */}
      <div
        className={`border p-4 ${
          domainAlignment.isCompatible
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-red-500/30 bg-red-500/5"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <Building2
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                domainAlignment.isCompatible
                  ? "text-emerald-500"
                  : "text-red-500"
              }`}
            />
            <div>
              <h4 className="text-[11px] font-bold tracking-wider uppercase">
                Domain / Bidang
              </h4>
              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="bg-muted/60 px-1.5 py-0.5 font-medium">
                  {domainAlignment.resumeDomain}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="bg-muted/60 px-1.5 py-0.5 font-medium">
                  {domainAlignment.jobDomain}
                </span>
              </div>
            </div>
          </div>
          <ScorePill score={domainAlignment.score} />
        </div>
        <div className="mt-3 space-y-2">
          <MiniBar value={domainAlignment.score} />
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {domainAlignment.reasoning}
          </p>
          {!domainAlignment.isCompatible && (
            <p className="border-l-2 border-red-500 bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-700">
              ⚠️ Domain tidak kompatibel — skor dibatasi maksimal 25 dan apply tidak direkomendasikan.
            </p>
          )}
        </div>
      </div>

      {/* Role / seniority */}
      <div className="border-border space-y-3 border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <Users className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <h4 className="text-[11px] font-bold tracking-wider uppercase">
                Senioritas / Role
              </h4>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold ${seniorityBg[roleAlignment.seniorityMatch]}`}
                >
                  {seniorityLabel[roleAlignment.seniorityMatch]}
                </span>
                {roleAlignment.yearsExperienceRequired !== null && (
                  <span className="text-muted-foreground text-[10px]">
                    Butuh ~{roleAlignment.yearsExperienceRequired} thn
                  </span>
                )}
                {roleAlignment.yearsExperienceCandidate !== null && (
                  <span className="text-muted-foreground text-[10px]">
                    · Kandidat ~{roleAlignment.yearsExperienceCandidate} thn
                  </span>
                )}
              </div>
            </div>
          </div>
          <ScorePill score={roleAlignment.score} />
        </div>
        <MiniBar value={roleAlignment.score} />
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          {roleAlignment.reasoning}
        </p>
      </div>

      {/* Experience alignment */}
      <div className="border-border space-y-3 border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <Briefcase className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <h4 className="text-[11px] font-bold tracking-wider uppercase">
              Relevansi Pengalaman
            </h4>
          </div>
          <ScorePill score={experienceAlignment.score} />
        </div>
        <MiniBar value={experienceAlignment.score} />
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          {experienceAlignment.reasoning}
        </p>

        {experienceAlignment.relevantHighlights.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {experienceAlignment.relevantHighlights.map((h, i) => (
              <div
                key={i}
                className="border-border/50 bg-muted/20 border-l-2 px-2.5 py-1.5"
                style={{
                  borderLeftColor:
                    h.relevance === "high"
                      ? "rgb(16 185 129)"
                      : h.relevance === "medium"
                        ? "rgb(245 158 11)"
                        : "rgb(148 163 184)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold">{h.title}</span>
                  <span
                    className={`px-1 py-0 text-[8px] font-bold ${
                      h.relevance === "high"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : h.relevance === "medium"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {h.relevance.toUpperCase()}
                  </span>
                </div>
                <p className="text-muted-foreground text-[10px]">{h.company}</p>
                <p className="text-muted-foreground mt-1 text-[10px]">
                  {h.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
