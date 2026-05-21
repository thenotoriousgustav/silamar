"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Flame, Loader2, Skull } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserResumesAction } from "@/features/job-tracker/actions";

import { roastResumeAction } from "../actions/roast-resume";
import type { RoastIntensity, RoastResult } from "../schemas";

import { RoastResultDisplay } from "./roast-result-display";

const INTENSITY_OPTIONS: {
  id: RoastIntensity;
  emoji: string;
  label: string;
  description: string;
  bgClass: string;
  borderClass: string;
}[] = [
  {
    id: "lembut",
    emoji: "🥹",
    label: "Lembut",
    description:
      "Sahabat yang nge-roast tapi sayang. Sindiran halus, banyak humor.",
    bgClass: "bg-blue-500/5",
    borderClass: "border-blue-500/30",
  },
  {
    id: "sedang",
    emoji: "😏",
    label: "Sedang",
    description:
      "Komika yang roast temannya. Tajam, sarkastik, tapi masih beretika.",
    bgClass: "bg-amber-500/5",
    borderClass: "border-amber-500/30",
  },
  {
    id: "brutal",
    emoji: "🔥",
    label: "Brutal",
    description: "Tanpa ampun. Roast Battle level. Sakit tapi ketawa keras.",
    bgClass: "bg-red-500/5",
    borderClass: "border-red-500/30",
  },
];

const LOADING_MESSAGES = [
  "Sedang ngintip resume kamu... 👀",
  "AI lagi nyari bahan ejekan...",
  "Mempersiapkan amunisi roasting 🔫",
  "Cengiran AI lagi pas-pasan ini...",
  "Lagi mikir kata-kata yang nyentil...",
];

export function ResumeRoastClient() {
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [intensity, setIntensity] = useState<RoastIntensity>("sedang");
  const [result, setResult] = useState<RoastResult | null>(null);
  const [usedIntensity, setUsedIntensity] = useState<RoastIntensity>("sedang");
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);

  const { data: resumes = [], isLoading: isLoadingResumes } = useQuery({
    queryKey: ["user-resumes"],
    queryFn: () => getUserResumesAction(),
  });

  const roastMutation = useMutation({
    mutationFn: async () => {
      // Cycle loading messages
      const interval = setInterval(() => {
        setLoadingMsg(
          LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
        );
      }, 1500);

      try {
        const res = await roastResumeAction({
          resumeId: selectedResumeId,
          intensity,
        });
        return res;
      } finally {
        clearInterval(interval);
      }
    },
    onSuccess: (res) => {
      if (res.success) {
        setResult(res.data);
        setUsedIntensity(intensity);
      } else {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Gagal me-roast. Coba lagi ya.");
    },
  });

  const handleStart = () => {
    if (!selectedResumeId) {
      toast.error("Pilih resume dulu dong");
      return;
    }
    roastMutation.mutate();
  };

  const handleRoastAgain = () => {
    setResult(null);
  };

  // ── Result view ──
  if (result) {
    return (
      <RoastResultDisplay
        result={result}
        intensity={usedIntensity}
        onRoastAgain={handleRoastAgain}
      />
    );
  }

  // ── Loading view ──
  if (roastMutation.isPending) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 py-12 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30">
            <Flame className="h-12 w-12 animate-bounce text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-bold">{loadingMsg}</p>
          <p className="text-muted-foreground text-sm">
            Tahan dulu, AI lagi cari titik lemah resume kamu...
          </p>
        </div>
        <div className="bg-muted h-1 w-64 overflow-hidden">
          <div
            className="h-full animate-pulse bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"
            style={{ width: "70%" }}
          />
        </div>
      </div>
    );
  }

  // ── Landing / setup view ──
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      {/* Hero header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30">
          <Skull className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Mock Your Resume 🔥
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Siap mental? AI bakal roasting resume kamu tanpa ampun.
            <br />
            <span className="text-xs">
              (For fun only — buat hasil profesional, pakai analisis biasa.)
            </span>
          </p>
        </div>
      </div>

      {/* Resume picker */}
      <div className="border-border space-y-5 border p-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold tracking-wider uppercase">
            Pilih Resume Korban
          </Label>
          {isLoadingResumes ? (
            <div className="border-border flex h-10 items-center justify-center border">
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="border-border border border-dashed p-6 text-center">
              <p className="text-muted-foreground text-sm">
                Belum ada resume buat di-roast.{" "}
                <a href="/documents/resumes" className="text-primary underline">
                  Buat dulu
                </a>{" "}
                ya.
              </p>
            </div>
          ) : (
            <Select
              value={selectedResumeId}
              onValueChange={setSelectedResumeId}
            >
              <SelectTrigger className="border-border rounded-none">
                <SelectValue placeholder="Pilih resume yang siap di-bully..." />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {resumes.map((r: any) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Intensity picker */}
        <div className="space-y-2">
          <Label className="text-xs font-bold tracking-wider uppercase">
            Level Kebrutalan
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {INTENSITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setIntensity(opt.id)}
                className={`group flex flex-col items-center gap-2 border p-4 text-center transition-all ${
                  intensity === opt.id
                    ? `${opt.bgClass} ${opt.borderClass} border-2`
                    : "border-border hover:border-border/80 hover:bg-muted/30"
                }`}
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {opt.emoji}
                </span>
                <p className="text-xs font-bold">{opt.label}</p>
                <p className="text-muted-foreground text-[10px] leading-tight">
                  {opt.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/40 border-border/50 border p-3">
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> Roasting ini sengaja sarkastik dan
            menyindir untuk hiburan. AI tidak menyerang aspek pribadi
            (ras/agama/gender/dll). Kalau lagi sensitif, pilih mode{" "}
            <strong>Lembut</strong> aja ya.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={handleStart}
          disabled={!selectedResumeId || roastMutation.isPending}
          className="h-12 w-full gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:from-red-600 hover:to-orange-600 hover:shadow-red-500/40"
        >
          <Flame className="h-4 w-4" />
          Mulai Roast Resume Saya (1 Kredit)
        </Button>
      </div>
    </div>
  );
}
