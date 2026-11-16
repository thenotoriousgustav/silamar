"use client";

import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SpotlightCard } from "@/components/ui/spotlight-card";

interface RoleSimulation {
  id: string;
  title: string;
  score: number;
  verdict: string;
  targetCompany: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  sampleBullet: string;
  aiSuggestion: string;
}

const SIMULATION_ROLES: RoleSimulation[] = [
  {
    id: "frontend",
    title: "Frontend Engineer",
    score: 91,
    verdict: "Sangat Direkomendasikan (Top 8%)",
    targetCompany: "Tech Scale-up / Unicorn ID",
    matchedKeywords: [
      "React.js",
      "Next.js 15+",
      "TypeScript",
      "Tailwind CSS",
      "REST API",
      "State Management",
    ],
    missingKeywords: ["Unit Testing (Vitest/Jest)", "CI/CD Pipeline"],
    sampleBullet:
      "Mengembangkan fitur dashboard analitik interaktif dengan Next.js & React Query, memangkas waktu muat halaman sebesar 38%.",
    aiSuggestion:
      "Tambahkan metrik kuantitatif pengujian otomatis untuk memenuhi syarat spesifikasi level Mid.",
  },
  {
    id: "product-design",
    title: "Product Designer (UI/UX)",
    score: 88,
    verdict: "Kuat & Kompetitif (Top 12%)",
    targetCompany: "Digital Agency / Fintech",
    matchedKeywords: [
      "Figma Prototyping",
      "Design System",
      "Usability Testing",
      "Wireframing",
      "Information Architecture",
    ],
    missingKeywords: ["Micro-interactions (Motion)", "Design Tokens"],
    sampleBullet:
      "Merancang ulang alur registrasi pengguna (onboarding flow) yang meningkatkan konversi pengguna baru sebesar 24% dalam 30 hari.",
    aiSuggestion:
      "Sertakan tautan case study Figma yang mendokumentasikan riset wawancara kualitatif.",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    score: 86,
    verdict: "Lolos Screening ATS",
    targetCompany: "E-Commerce / Banking",
    matchedKeywords: [
      "SQL (PostgreSQL)",
      "Python (Pandas)",
      "Tableau Dashboard",
      "Data Cleaning",
      "Cohort Analysis",
    ],
    missingKeywords: ["A/B Testing Framework", "BigQuery"],
    sampleBullet:
      "Menganalisis 500k+ baris data transaksi harian menggunakan SQL untuk mengidentifikasi anomali churn rate pelanggan.",
    aiSuggestion:
      "Pertegas metodologi validasi hipotesis dan keputusan bisnis yang dihasilkan dari analisis data Anda.",
  },
  {
    id: "product-manager",
    title: "Associate Product Manager",
    score: 89,
    verdict: "Sangat Relevan (Top 10%)",
    targetCompany: "Enterprise SaaS / Startup",
    matchedKeywords: [
      "Product Requirements (PRD)",
      "Agile/Scrum",
      "User Journey Mapping",
      "KPI Tracking",
      "Cross-Functional Leadership",
    ],
    missingKeywords: ["Go-to-Market Strategy", "Financial Modeling"],
    sampleBullet:
      "Memimpin sprint 2-mingguan bersama 6 engineer untuk merilis integrasi gateway pembayaran tepat waktu sesuai target Q3.",
    aiSuggestion:
      "Tambahkan dampak bisnis langsung (efisiensi biaya operasional atau peningkatan retensi).",
  },
];

export function AtsSimulator() {
  const [activeId, setActiveId] = useState<string>("frontend");
  const current =
    SIMULATION_ROLES.find((r) => r.id === activeId) ?? SIMULATION_ROLES[0];

  const [displayScore, setDisplayScore] = useState(current.score);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayScore;
    const diff = current.score - startValue;
    const duration = 500;

    let frameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startValue + diff * ease));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [current.score]);

  return (
    <SpotlightCard className="p-6 sm:p-8" spotlightColor="rgba(16, 185, 129, 0.07)">
      {/* Header telemetry bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          <span>SIMULATOR_ATS_SCANNER // REALTIME_PREVIEW</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-xs text-emerald-400">
            Model: ATS Match Engine v2.4
          </span>
        </div>
      </div>

      {/* Role Picker Buttons */}
      <div className="mt-6">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">
          Pilih Contoh Posisi Karir:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SIMULATION_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveId(role.id)}
              className={`p-3 text-left font-mono text-xs transition-all border ${
                activeId === role.id
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                  : "bg-muted/40 text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              <div className="truncate font-semibold">{role.title}</div>
              <div className="text-xs opacity-80 mt-1">
                Skor ATS: {role.score}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live HUD Output Container */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Left: Score & Verdict */}
        <div className="lg:col-span-4 border border-border bg-background/50 p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Skor Kompatibilitas ATS
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-6xl font-extrabold text-foreground tracking-tight transition-all">
                {displayScore}
              </span>
              <span className="font-mono text-xl text-muted-foreground">/100</span>
            </div>

            {/* Meter bar with smooth transition */}
            <div className="mt-4 h-2 w-full bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${displayScore}%` }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {current.verdict}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground font-mono space-y-1.5">
            <div>Benchmark Target:</div>
            <div className="text-foreground font-semibold">{current.targetCompany}</div>
          </div>
        </div>

        {/* Right: Keywords & Suggestions */}
        <div className="lg:col-span-8 border border-border bg-background/50 p-6 space-y-6">
          {/* Matched Keywords */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Keyword ATS Terdeteksi ({current.matchedKeywords.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono transition-transform hover:scale-105 cursor-default"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                Kesenjangan Keyword Yang Disarankan ({current.missingKeywords.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 text-xs font-mono transition-transform hover:scale-105 cursor-default"
                >
                  ! {kw}
                </span>
              ))}
            </div>
          </div>

          {/* AI Suggestion Box */}
          <div className="border border-border bg-card p-4 transition-colors hover:border-primary/40">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Rekomendasi Aksi AI Instan:</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              "{current.aiSuggestion}"
            </p>
          </div>

          {/* CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground font-mono">
              Ingin cek resume asli kamu secara mendalam?
            </span>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all hover:translate-x-0.5"
            >
              Scan Resume Kamu Gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
