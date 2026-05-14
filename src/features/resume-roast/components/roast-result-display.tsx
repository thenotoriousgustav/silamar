"use client";

import { Flame, RotateCcw, Share2, Skull, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { RoastIntensity, RoastResult } from "../schemas";

interface RoastResultDisplayProps {
  result: RoastResult;
  intensity: RoastIntensity;
  onRoastAgain: () => void;
}

const INTENSITY_META: Record<
  RoastIntensity,
  { label: string; emoji: string; color: string }
> = {
  lembut: { label: "Lembut", emoji: "🥹", color: "text-blue-500" },
  sedang: { label: "Sedang", emoji: "😏", color: "text-amber-500" },
  brutal: { label: "Brutal", emoji: "🔥", color: "text-red-500" },
};

export function RoastResultDisplay({
  result,
  intensity,
  onRoastAgain,
}: RoastResultDisplayProps) {
  const meta = INTENSITY_META[intensity];

  // Color mapping by brutal score
  const scoreColor =
    result.brutalScore >= 80
      ? "text-emerald-500"
      : result.brutalScore >= 50
        ? "text-amber-500"
        : result.brutalScore >= 30
          ? "text-orange-500"
          : "text-red-500";

  const handleShare = () => {
    const text = `🔥 Resume saya barusan di-roast AI:\n\n"${result.openingRoast}"\n\nSkor brutal: ${result.brutalScore}/100\n\nCoba sendiri di Silamar!`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      {/* Header — intensity badge + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted/50 border-border flex items-center gap-2 border px-3 py-1.5">
            <span className="text-base">{meta.emoji}</span>
            <span className={`text-xs font-bold tracking-wider uppercase ${meta.color}`}>
              Mode {meta.label}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="h-8 gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            <span className="text-xs">Share</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onRoastAgain} className="h-8 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="text-xs">Roast Lagi</span>
          </Button>
        </div>
      </div>

      {/* Brutal Score — hero card */}
      <div className="border-border relative overflow-hidden border bg-gradient-to-br from-red-500/5 via-orange-500/5 to-amber-500/5 p-8">
        <div className="absolute top-4 right-4 opacity-10">
          <Flame className="h-32 w-32 text-red-500" />
        </div>
        <div className="relative space-y-3">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Skor Kebrutalan
          </p>
          <div className="flex items-end gap-3">
            <span className={`text-7xl font-black tabular-nums ${scoreColor}`}>
              {result.brutalScore}
            </span>
            <span className="text-muted-foreground mb-2 text-sm">/ 100</span>
          </div>
          <p className="text-foreground text-sm font-bold italic">
            &ldquo;{result.finalVerdict}&rdquo;
          </p>
        </div>
      </div>

      {/* Opening Roast */}
      <div className="border-l-destructive bg-muted/30 border border-l-4 p-5">
        <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
          <Zap className="h-3 w-3" />
          Opening Statement
        </p>
        <p className="text-base leading-relaxed font-semibold italic">
          &ldquo;{result.openingRoast}&rdquo;
        </p>
      </div>

      {/* Brutal Summary */}
      <div className="border-border space-y-3 border p-5">
        <p className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
          <Skull className="h-3 w-3" />
          Ringkasan Brutal
        </p>
        <p className="text-sm leading-relaxed">{result.brutalSummary}</p>
      </div>

      {/* Section Roasts */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold tracking-wider uppercase">
          🎯 Roast Per Section
        </h2>
        <div className="space-y-2">
          {result.sectionRoasts.map((sr, i) => (
            <div
              key={i}
              className="border-border group hover:border-destructive/40 hover:bg-destructive/5 border p-4 transition-colors"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="bg-destructive/10 text-destructive px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                  {sr.section}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{sr.roast}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Unique Problems */}
      <div className="border-border bg-amber-500/5 border-l-4 border-l-amber-500 p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-600 uppercase">
          <Flame className="h-3 w-3" />
          Masalah Unik yang Terdeteksi
        </h2>
        <ul className="space-y-2.5">
          {result.uniqueProblems.map((problem, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="text-amber-500 font-bold">{i + 1}.</span>
              <span className="flex-1">{problem}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Silver Lining */}
      <div className="border-border bg-emerald-500/5 border-l-4 border-l-emerald-500 p-5">
        <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          Sisi Positif (Iya, Ada Kok)
        </p>
        <p className="text-sm leading-relaxed">{result.silverLining}</p>
      </div>

      {/* Footer disclaimer */}
      <div className="text-muted-foreground border-border/50 border-t pt-6 text-center text-[11px] italic">
        💡 Roast ini dibuat untuk hiburan. Untuk feedback profesional, gunakan{" "}
        <a href="/skill-gap" className="text-primary underline">
          analisis resume
        </a>
        .
      </div>
    </div>
  );
}
