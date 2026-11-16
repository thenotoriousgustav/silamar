"use client";

import { AlertCircle, CheckCircle2, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroHud() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    const target = 89;

    let frameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setScore(Math.round(target * ease));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative border border-border bg-card/90 backdrop-blur-md p-6 shadow-2xl overflow-hidden group">
      {/* ─── Top Hairline Luminous Accent Edge ─────────────────────────── */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent z-10" />

      {/* ─── Sleek Razor-Thin 1px Laser Beam (No Muddy Background Wash) ── */}
      <div className="awwwards-laser pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.9)] z-20" />

      {/* Card Window Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-muted-foreground/40 inline-block"></span>
          <span className="h-2 w-2 bg-muted-foreground/40 inline-block"></span>
          <span className="h-2 w-2 bg-muted-foreground/40 inline-block"></span>
          <div className="flex items-center gap-1.5 ml-2 text-xs font-mono text-muted-foreground">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span>ATS_DIAGNOSTIC_HUD // V2.4</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono font-semibold">
            STATUS: OPTIMAL
          </span>
        </div>
      </div>

      {/* Target Job Info */}
      <div className="mt-5 space-y-1">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Target Posisi Lowongan:
        </div>
        <div className="text-sm font-bold text-foreground font-mono flex items-center justify-between">
          <span>Software Engineer (Fullstack)</span>
          <span className="text-xs font-normal text-muted-foreground">@ Scale-Up ID</span>
        </div>
      </div>

      {/* Score Meter Box */}
      <div className="mt-5 border border-border bg-background/60 p-4 transition-colors group-hover:border-emerald-500/30">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-mono text-muted-foreground">
            Skor Keterbacaan ATS:
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-4xl font-extrabold text-emerald-400 tracking-tight transition-all">
              {score}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Animated meter bar */}
        <div className="mt-3 h-1.5 w-full bg-muted overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all duration-1000 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="mt-2.5 flex justify-between text-xs font-mono text-muted-foreground">
          <span>Ambang Minimal: 70%</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span>●</span> Top 10% Teratas
          </span>
        </div>
      </div>

      {/* Verified Checklist */}
      <div className="mt-5 space-y-2.5 font-mono text-xs">
        <div className="flex items-start gap-2.5 text-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-snug">Format 1-kolom teruji kompatibel sistem ATS</span>
        </div>
        <div className="flex items-start gap-2.5 text-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-snug">Action verbs & metrik dampak terdeteksi</span>
        </div>
        <div className="flex items-start gap-2.5 text-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-snug">14 dari 16 kata kunci keahlian cocok</span>
        </div>
        <div className="flex items-start gap-2.5 text-amber-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-400" />
          <span className="leading-snug">Saran: Tambahkan 1 metrik kuantitatif di pengalaman magang</span>
        </div>
      </div>

      {/* Detected Keyword Chips */}
      <div className="mt-5 pt-4 border-t border-border">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center justify-between">
          <span>Keyword ATS Terverifikasi:</span>
          <span className="text-emerald-400">6/6 Inti</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Next.js 15+",
            "React.js",
            "TypeScript",
            "Tailwind CSS",
            "PostgreSQL",
            "REST API",
          ].map((kw) => (
            <span
              key={kw}
              className="bg-muted/70 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 px-2 py-0.5 text-xs font-mono text-foreground border border-border transition-colors cursor-default"
            >
              ✓ {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
