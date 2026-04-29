"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  Sparkles,
  Zap,
  FileText,
  TrendingUp,
  SpellCheck,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Plus,
  Trash2,
  Settings2,
  Languages,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  calculateCompleteness,
  getCompletenessFeedback,
} from "@/lib/resume/completeness";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthPicker } from "@/components/ui/monthpicker";
import type {
  ResumeContent,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
} from "@/types/resume";
import { toast } from "sonner";

interface ResumeFormProps {
  content: ResumeContent;
  updatePersonalInfo: (info: Partial<ResumeContent["personalInfo"]>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ResumeExperience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<ResumeEducation>) => void;
  removeEducation: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<ResumeProject>) => void;
  removeProject: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  updateStyle: (style: Partial<ResumeContent["style"]>) => void;
}

export function ResumeForm({
  content,
  updatePersonalInfo,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addProject,
  updateProject,
  removeProject,
  updateSkills,
  updateStyle,
}: ResumeFormProps) {
  const [atsResult, setAtsResult] = useState<{
    score: number;
    feedback: string;
    criticalIssues: string[];
    missingKeywords: string[];
    readabilityScore: number;
  } | null>(null);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const optimizeMutation = useMutation({
    mutationFn: async ({
      expId,
      idx,
      text,
      type,
    }: {
      expId: string;
      idx: number;
      text: string;
      type: string;
    }) => {
      const res = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return { ...data, expId, idx };
    },
    onSuccess: (data) => {
      const currentExp = content.experience.find((e) => e.id === data.expId);
      if (currentExp) {
        const currentBullets = [...(currentExp.description || [])];
        currentBullets[data.idx] = data.result;
        updateExperience(data.expId, { description: currentBullets });
        toast.success("Teks berhasil dioptimasi!");
      }
    },
    onError: (error) => {
      console.error("Optimize error:", error);
      toast.error("Gagal mengoptimasi teks");
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/resume/analyze-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      setAtsResult(data);
    },
    onError: (error) => {
      console.error("ATS Error:", error);
      toast.error("Gagal menjalankan analisis ATS");
    },
  });

  const handleOptimize = (
    expId: string,
    idx: number,
    text: string,
    type: "optimize" | "quantify" | "grammar" = "optimize",
  ) => {
    if (!text || text.length < 5) {
      toast.error("Teks terlalu pendek untuk dioptimasi");
      return;
    }
    const loadingId = `${expId}-${idx}`;
    setOptimizingId(loadingId);
    optimizeMutation.mutate({ expId, idx, text, type });
  };

  const handleRunATSAnalysis = () => {
    analyzeMutation.mutate();
  };

  const completeness = calculateCompleteness(content);
  const score = completeness.score;
  const feedback = getCompletenessFeedback(score);
  const [isCompletenessOpen, setIsCompletenessOpen] = useState(false);
  const lang = content.style?.language || "id";

  return (
    <div className="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto p-6">
      {/* Completeness Dashboard - Wrapped to ensure visibility */}
      <Dialog open={isCompletenessOpen} onOpenChange={setIsCompletenessOpen}>
        <div className="shrink-0" onClick={() => setIsCompletenessOpen(true)}>
          <Card className="group border-primary/20 bg-card hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-none border shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
            {/* Click Indicator */}
            <div className="bg-primary/5 absolute top-2 right-2 flex items-center gap-1 rounded-none px-2 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-primary text-[9px] font-bold uppercase">
                Lihat Detail
              </span>
              <ChevronRight className="text-primary h-2.5 w-2.5" />
            </div>

            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-none border transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">
                      Kesiapan Resume
                    </h3>
                    <p
                      className={cn(
                        "text-[10px] font-medium tracking-wider uppercase",
                        feedback.color,
                      )}
                    >
                      {feedback.message}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-foreground text-2xl font-black">
                    {score}%
                  </span>
                </div>
              </div>

              <div className="bg-primary/10 border-primary/5 h-2.5 w-full overflow-hidden rounded-none border">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-out",
                    feedback.bg,
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    analyzeMutation.mutate();
                  }}
                  disabled={analyzeMutation.isPending}
                  className="hover:bg-primary/5 border-border bg-background h-8 gap-1.5 rounded-none text-[10px] font-bold transition-all"
                >
                  {analyzeMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <BarChart3 className="text-brand-500 h-3 w-3" />
                  )}
                  {analyzeMutation.isPending
                    ? "Menganalisis..."
                    : "Analisis Skor ATS"}
                </Button>
                <div className="border-border bg-background flex items-center gap-1.5 rounded-none border px-2.5 py-1 text-[10px] font-medium shadow-sm">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  ATS Format Validated
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogContent className="overflow-hidden rounded-none border-none p-0 shadow-2xl sm:max-w-2xl">
          <div className="from-primary/10 via-background to-background bg-linear-to-br p-8">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-14 w-14 items-center justify-center rounded-none shadow-lg">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-foreground text-2xl font-black tracking-tight italic">
                    RESUME READINESS
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 flex h-1.5 w-24 overflow-hidden rounded-none">
                      <div
                        className={cn("h-full", feedback.bg)}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                      {score}% COMPLETED
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-black tracking-tighter uppercase italic",
                    feedback.color,
                  )}
                >
                  {feedback.message}
                </p>
                <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                  Current Status
                </p>
              </div>
            </div>

            <div className="custom-scrollbar grid max-h-[60vh] grid-cols-1 gap-6 overflow-y-auto pr-2 md:grid-cols-2">
              {Array.from(
                new Set(completeness.suggestions.map((s) => s.category)),
              ).map((category) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="bg-primary h-1 w-1 rounded-none" />
                    <h4 className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
                      {category}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {completeness.suggestions
                      .filter((s) => s.category === category)
                      .map((s, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "group flex items-center gap-3 rounded-none border p-3 transition-all",
                            s.completed
                              ? "border-emerald-500/10 bg-emerald-500/5 opacity-60"
                              : "bg-background border-border hover:border-primary/30 shadow-sm",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-none transition-transform group-hover:scale-110",
                              s.completed
                                ? "bg-emerald-500/20 text-emerald-600"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {s.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Plus className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "text-[11px] leading-tight font-bold tracking-tight",
                                s.completed
                                  ? "text-emerald-700/70 line-through"
                                  : "text-foreground",
                              )}
                            >
                              {s.text}
                            </span>
                            {!s.completed && (
                              <span className="text-primary/60 text-[9px] font-black uppercase">
                                Impact: +{s.weight}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-primary/5 mt-8 flex items-center justify-between border-t pt-6">
              <p className="text-muted-foreground max-w-50 text-[10px] font-medium">
                Lengkapi semua poin di atas untuk mendapatkan skor maksimal dan
                meningkatkan peluang ATS.
              </p>
              <Button
                className="shadow-primary/20 h-12 rounded-none px-8 font-black tracking-tighter uppercase italic shadow-xl transition-all hover:scale-105 active:scale-95"
                onClick={() => setIsCompletenessOpen(false)}
              >
                GOT IT, LETS GO!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ATS Result Dialog */}
      <Dialog
        open={!!atsResult}
        onOpenChange={(open) => !open && setAtsResult(null)}
      >
        <DialogContent className="bg-background sm:max-w-180">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="text-brand-500 h-6 w-6" />
              {analyzeMutation.isPending
                ? "Menganalisis..."
                : "Analisis ATS AI"}
            </DialogTitle>
            <DialogDescription>
              Hasil analisis mendalam untuk mengoptimalkan peluang Anda lolos
              seleksi.
            </DialogDescription>
          </DialogHeader>

          {atsResult && (
            <div className="grid gap-6 py-4 md:grid-cols-2">
              {/* Scores */}
              <div className="space-y-6">
                <div className="glass flex flex-col items-center justify-center rounded-none p-6 text-center">
                  <span className="text-muted-foreground mb-1 text-xs font-bold tracking-widest uppercase">
                    ATS Match Score
                  </span>
                  <span
                    className={cn(
                      "text-5xl font-black",
                      atsResult.score >= 80
                        ? "text-emerald-500"
                        : atsResult.score >= 60
                          ? "text-amber-500"
                          : "text-red-500",
                    )}
                  >
                    {atsResult.score}%
                  </span>
                  <p className="text-muted-foreground mt-4 text-xs italic">
                    {atsResult.feedback}
                  </p>
                </div>

                <div className="glass rounded-none p-5">
                  <h4 className="text-muted-foreground mb-3 text-xs font-bold tracking-widest uppercase">
                    Readability
                  </h4>
                  <div className="bg-primary/10 border-primary/5 h-2.5 w-full overflow-hidden rounded-none border">
                    <div
                      className="bg-primary h-full transition-all duration-1000 ease-out"
                      style={{ width: `${atsResult.readabilityScore}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-medium">
                    <span>Sulit</span>
                    <span className="text-primary">
                      {atsResult.readabilityScore}% Sangat Mudah
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Masalah Kritis
                  </h4>
                  <div className="space-y-2">
                    {atsResult.criticalIssues.map((issue, i) => (
                      <div
                        key={i}
                        className="bg-muted/50 flex items-start gap-3 rounded-none p-3 text-xs"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-none bg-amber-500" />
                        {issue}
                      </div>
                    ))}
                    {atsResult.criticalIssues.length === 0 && (
                      <p className="text-muted-foreground text-xs italic">
                        Tidak ditemukan masalah kritis.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Keyword yang Disarankan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {atsResult.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-none bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Accordion
        defaultValue={["personal"]}
        multiple
        className="w-full space-y-4 border-none"
      >
        {/* Section: Personal Info */}
        <AccordionItem
          value="personal"
          className="bg-card border-border hover:border-primary/20 overflow-hidden border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                <User className="h-4 w-4" />
              </div>
              <span className="text-foreground font-semibold tracking-tight">
                Informasi Pribadi
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Nama Lengkap
                </Label>
                <Input
                  id="fullName"
                  value={content.personalInfo.fullName}
                  onChange={(e) =>
                    updatePersonalInfo({ fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Gelar / Posisi
                </Label>
                <Input
                  id="title"
                  value={content.personalInfo.title}
                  onChange={(e) =>
                    updatePersonalInfo({ title: e.target.value })
                  }
                  placeholder="Senior Frontend Developer"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={content.personalInfo.email}
                  onChange={(e) =>
                    updatePersonalInfo({ email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  value={content.personalInfo.phone}
                  onChange={(e) =>
                    updatePersonalInfo({ phone: e.target.value })
                  }
                  placeholder="+62 812 3456 7890"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Lokasi
                </Label>
                <Input
                  id="location"
                  value={content.personalInfo.location}
                  onChange={(e) =>
                    updatePersonalInfo({ location: e.target.value })
                  }
                  placeholder="Jakarta, Indonesia"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Website / Portfolio (Opsional)
                </Label>
                <Input
                  id="website"
                  value={content.personalInfo.website}
                  onChange={(e) =>
                    updatePersonalInfo({ website: e.target.value })
                  }
                  placeholder="https://johndoe.com"
                  className="bg-background border-border focus:border-primary focus:ring-primary transition-all focus:ring-1"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="summary"
                  className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
                >
                  Ringkasan Profesional
                </Label>
                <Textarea
                  id="summary"
                  value={content.personalInfo.summary}
                  onChange={(e) =>
                    updatePersonalInfo({ summary: e.target.value })
                  }
                  placeholder="Ceritakan singkat tentang pengalaman dan keahlianmu..."
                  className="bg-background border-border focus:border-primary focus:ring-primary min-h-24 transition-all focus:ring-1"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Experience */}
        <AccordionItem
          value="experience"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-foreground font-semibold tracking-tight">
                  Pengalaman Kerja
                </span>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  addExperience();
                }}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
                title="Tambah Pengalaman"
              >
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="flex flex-col gap-6">
              {content.experience.map((exp: ResumeExperience) => (
                <Card
                  key={exp.id}
                  className="bg-muted/20 border-border relative overflow-hidden rounded-none"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(exp.id)}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground absolute top-2 right-2 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Perusahaan
                        </Label>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              company: e.target.value,
                            })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Posisi
                        </Label>
                        <Input
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              position: e.target.value,
                            })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Tanggal Mulai
                        </Label>
                        <Popover>
                          <PopoverTrigger
                            render={
                              <Button
                                variant="outline"
                                className={cn(
                                  "bg-background border-border w-full justify-start text-left font-normal",
                                  !exp.startDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {exp.startDate ? (
                                  exp.startDate
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                              </Button>
                            }
                          />
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthPicker
                              selectedMonth={
                                exp.startDate
                                  ? parse(
                                      exp.startDate,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onMonthSelect={(date) => {
                                if (date) {
                                  updateExperience(exp.id, {
                                    startDate: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Tanggal Selesai
                        </Label>
                        <Popover>
                          <PopoverTrigger
                            render={
                              <Button
                                variant="outline"
                                disabled={exp.isCurrentJob}
                                className={cn(
                                  "bg-background border-border w-full justify-start text-left font-normal",
                                  !exp.endDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {exp.isCurrentJob ? (
                                  "Present"
                                ) : exp.endDate ? (
                                  exp.endDate
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                              </Button>
                            }
                          />
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthPicker
                              selectedMonth={
                                exp.endDate
                                  ? parse(
                                      exp.endDate,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onMonthSelect={(date) => {
                                if (date) {
                                  updateExperience(exp.id, {
                                    endDate: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center space-x-2 py-1 md:col-span-2">
                        <Checkbox
                          id={`current-${exp.id}`}
                          checked={exp.isCurrentJob}
                          onCheckedChange={(checked) =>
                            updateExperience(exp.id, {
                              isCurrentJob: !!checked,
                              endDate: checked ? "" : exp.endDate,
                            })
                          }
                        />
                        <Label
                          htmlFor={`current-${exp.id}`}
                          className="text-xs leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Masih bekerja disini
                        </Label>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                            {lang === "id"
                              ? "Deskripsi & Pencapaian"
                              : "Key Responsibilities & Achievements"}
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const bullets = [...(exp.description || [])];
                              bullets.push("");
                              updateExperience(exp.id, {
                                description: bullets,
                              });
                            }}
                            className="h-7 gap-1 px-2 text-[10px] font-bold"
                          >
                            <Plus className="h-3 w-3" /> Add Bullet
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {(() => {
                            const bullets = Array.isArray(exp.description)
                              ? exp.description
                              : exp.description
                                ? [exp.description]
                                : [];

                            return bullets.map((bullet, idx) => (
                              <div
                                key={`${exp.id}-bullet-${idx}`}
                                className="group flex items-start gap-2"
                              >
                                <span className="text-muted-foreground mt-2.5 w-4 text-[10px] font-bold">
                                  {idx + 1}.
                                </span>
                                <Input
                                  value={bullet}
                                  onChange={(e) => {
                                    const newBullets = [...bullets];
                                    newBullets[idx] = e.target.value;
                                    const field =
                                      lang === "id"
                                        ? "descriptionId"
                                        : "descriptionEn";
                                    updateExperience(exp.id, {
                                      [field]: newBullets,
                                      description:
                                        lang === "id"
                                          ? newBullets
                                          : exp.description,
                                    });
                                  }}
                                  placeholder={
                                    lang === "id"
                                      ? "Contoh: Meningkatkan efisiensi sistem sebesar 20%..."
                                      : "Example: Improved system efficiency by 20%..."
                                  }
                                  className="bg-background border-border h-9 text-sm"
                                />
                                <div className="border-border bg-background flex shrink-0 items-center overflow-hidden rounded-none border shadow-sm">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const newBullets = [...bullets];
                                      [newBullets[idx - 1], newBullets[idx]] = [
                                        newBullets[idx],
                                        newBullets[idx - 1],
                                      ];
                                      const field =
                                        lang === "id"
                                          ? "descriptionId"
                                          : "descriptionEn";
                                      updateExperience(exp.id, {
                                        [field]: newBullets,
                                        description:
                                          lang === "id"
                                            ? newBullets
                                            : exp.description,
                                      });
                                    }}
                                    className="border-border h-8 w-8 rounded-none border-r"
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={idx === bullets.length - 1}
                                    onClick={() => {
                                      const newBullets = [...bullets];
                                      [newBullets[idx], newBullets[idx + 1]] = [
                                        newBullets[idx + 1],
                                        newBullets[idx],
                                      ];
                                      const field =
                                        lang === "id"
                                          ? "descriptionId"
                                          : "descriptionEn";
                                      updateExperience(exp.id, {
                                        [field]: newBullets,
                                        description:
                                          lang === "id"
                                            ? newBullets
                                            : exp.description,
                                      });
                                    }}
                                    className="border-border h-8 w-8 rounded-none border-r"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger
                                      render={
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          disabled={
                                            optimizingId === `${exp.id}-${idx}`
                                          }
                                          className="text-brand-500 hover:bg-brand-500/10 hover:text-brand-600 h-8 w-8 rounded-none border-r"
                                          title="AI Assistant"
                                        >
                                          {optimizingId ===
                                          `${exp.id}-${idx}` ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          ) : (
                                            <Sparkles className="h-3 w-3" />
                                          )}
                                        </Button>
                                      }
                                    />
                                    <DropdownMenuContent
                                      align="start"
                                      className="w-56"
                                    >
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleOptimize(
                                            exp.id,
                                            idx,
                                            bullet,
                                            "optimize",
                                          )
                                        }
                                        className="gap-2 py-2"
                                      >
                                        <FileText className="text-brand-500 h-4 w-4" />
                                        <div>
                                          <p className="text-xs font-bold">
                                            Optimalkan Kalimat
                                          </p>
                                          <p className="text-muted-foreground text-[10px]">
                                            Gunakan kata kerja yang lebih kuat
                                          </p>
                                        </div>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleOptimize(
                                            exp.id,
                                            idx,
                                            bullet,
                                            "quantify",
                                          )
                                        }
                                        className="gap-2 py-2"
                                      >
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        <div>
                                          <p className="text-xs font-bold">
                                            Tambahkan Metrik
                                          </p>
                                          <p className="text-muted-foreground text-[10px]">
                                            Sertakan angka pencapaian
                                          </p>
                                        </div>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleOptimize(
                                            exp.id,
                                            idx,
                                            bullet,
                                            "grammar",
                                          )
                                        }
                                        className="gap-2 py-2"
                                      >
                                        <SpellCheck className="h-4 w-4 text-amber-500" />
                                        <div>
                                          <p className="text-xs font-bold">
                                            Perbaiki Grammar
                                          </p>
                                          <p className="text-muted-foreground text-[10px]">
                                            Cek typo dan tata bahasa
                                          </p>
                                        </div>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const newBullets = bullets.filter(
                                        (_, i) => i !== idx,
                                      );
                                      const field =
                                        lang === "id"
                                          ? "descriptionId"
                                          : "descriptionEn";
                                      updateExperience(exp.id, {
                                        [field]:
                                          newBullets.length > 0
                                            ? newBullets
                                            : [""],
                                        description:
                                          lang === "id"
                                            ? newBullets.length > 0
                                              ? newBullets
                                              : [""]
                                            : exp.description,
                                      });
                                    }}
                                    className="hover:text-destructive h-8 w-8 rounded-none"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                        {(exp.description || []).length > 0 && (
                          <p className="text-muted-foreground text-[10px] italic">
                            * Kamu bisa memindahkan urutan atau menghapus poin
                            pencapaian dengan tombol di samping.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.experience.length === 0 && (
                <EmptyState
                  message="Belum ada pengalaman kerja"
                  onAdd={addExperience}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Education */}
        <AccordionItem
          value="education"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-foreground font-semibold tracking-tight">
                  Edukasi
                </span>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  addEducation();
                }}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
                title="Tambah Edukasi"
              >
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="flex flex-col gap-6">
              {content.education.map((edu: ResumeEducation) => (
                <Card
                  key={edu.id}
                  className="bg-muted/20 border-border relative overflow-hidden rounded-none"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducation(edu.id)}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground absolute top-2 right-2 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Institusi
                        </Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(edu.id, {
                              institution: e.target.value,
                            })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Gelar
                        </Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, { degree: e.target.value })
                          }
                          placeholder="S1"
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Jurusan
                        </Label>
                        <Input
                          value={edu.major}
                          onChange={(e) =>
                            updateEducation(edu.id, { major: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          GPA (Opsional)
                        </Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) =>
                            updateEducation(edu.id, { gpa: e.target.value })
                          }
                          placeholder="3.85 / 4.00"
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Bulan/Tahun Mulai
                        </Label>
                        <Popover>
                          <PopoverTrigger
                            render={
                              <div className="relative">
                                <Input
                                  readOnly
                                  value={edu.startYear}
                                  placeholder="Pilih bulan & tahun"
                                  className="bg-background border-border focus:ring-primary/50 cursor-pointer pr-10 focus:ring-1"
                                />
                                <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                              </div>
                            }
                          />
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthPicker
                              selectedMonth={
                                edu.startYear
                                  ? parse(
                                      edu.startYear,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onMonthSelect={(date) => {
                                if (date) {
                                  updateEducation(edu.id, {
                                    startYear: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Bulan/Tahun Selesai
                        </Label>
                        <Popover>
                          <PopoverTrigger
                            render={
                              <div className="relative">
                                <Input
                                  readOnly
                                  value={edu.endYear}
                                  placeholder="Pilih bulan & tahun"
                                  className="bg-background border-border focus:ring-primary/50 cursor-pointer pr-10 focus:ring-1"
                                  disabled={edu.isCurrentlyStudying}
                                />
                                <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                              </div>
                            }
                          />
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthPicker
                              selectedMonth={
                                edu.endYear
                                  ? parse(
                                      edu.endYear,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onMonthSelect={(date) => {
                                if (date) {
                                  updateEducation(edu.id, {
                                    endYear: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Pencapaian / Aktivitas
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const current = edu.description || [];
                            updateEducation(edu.id, {
                              description: [...current, ""],
                            });
                          }}
                          className="hover:border-primary/50 hover:bg-primary/5 h-7 gap-1 px-2 text-[10px] font-semibold transition-all"
                        >
                          <Plus className="h-3 w-3" />
                          Tambah Poin
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {(edu.description || []).map((bullet, idx) => (
                          <div
                            key={idx}
                            className="group flex items-start gap-2"
                          >
                            <div className="bg-primary/20 text-primary mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-none text-[10px] font-bold">
                              {idx + 1}
                            </div>
                            <div className="relative flex-1">
                              <textarea
                                value={bullet}
                                onChange={(e) => {
                                  const newDesc = [...(edu.description || [])];
                                  newDesc[idx] = e.target.value;
                                  updateEducation(edu.id, {
                                    description: newDesc,
                                  });
                                }}
                                placeholder="Contoh: Lulus dengan predikat Cum Laude atau Aktif di organisasi mahasiswa..."
                                className="bg-background border-border focus:border-primary/50 custom-scrollbar min-h-15 w-full resize-none rounded-none border p-3 text-sm transition-all focus:ring-0"
                                rows={2}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newDesc = [...(edu.description || [])];
                                newDesc.splice(idx, 1);
                                updateEducation(edu.id, {
                                  description: newDesc,
                                });
                              }}
                              className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-8 w-8 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                        {(edu.description || []).length === 0 && (
                          <p className="text-muted-foreground py-2 text-center text-xs italic">
                            Belum ada pencapaian yang ditambahkan.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.education.length === 0 && (
                <EmptyState
                  message="Belum ada data edukasi"
                  onAdd={addEducation}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Projects */}
        <AccordionItem
          value="projects"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                  <Code2 className="h-4 w-4" />
                </div>
                <span className="text-foreground font-semibold tracking-tight">
                  Projek
                </span>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  addProject();
                }}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex h-8 w-8 items-center justify-center rounded-none transition-all"
                title="Tambah Projek"
              >
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="flex flex-col gap-6">
              {content.projects.map((project: ResumeProject) => (
                <Card
                  key={project.id}
                  className="bg-muted/20 border-border relative overflow-hidden rounded-none"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProject(project.id)}
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground absolute top-2 right-2 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Nama Projek
                        </Label>
                        <Input
                          value={project.name}
                          onChange={(e) =>
                            updateProject(project.id, { name: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Tautan Projek (Opsional)
                        </Label>
                        <Input
                          value={project.link}
                          onChange={(e) =>
                            updateProject(project.id, { link: e.target.value })
                          }
                          placeholder="https://github.com/..."
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Bulan/Tahun Mulai
                        </Label>
                        <Popover>
                          <PopoverTrigger
                            render={
                              <div className="relative">
                                <Input
                                  readOnly
                                  value={project.startDate}
                                  placeholder="Pilih bulan & tahun"
                                  className="bg-background border-border focus:ring-primary/50 cursor-pointer pr-10 focus:ring-1"
                                />
                                <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                              </div>
                            }
                          />
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthPicker
                              selectedMonth={
                                project.startDate
                                  ? parse(
                                      project.startDate,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onMonthSelect={(date) => {
                                if (date) {
                                  updateProject(project.id, {
                                    startDate: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-medium uppercase">
                          Bulan/Tahun Selesai
                        </Label>
                        <Popover>
                          <PopoverTrigger
                            render={
                              <div className="relative">
                                <Input
                                  readOnly
                                  value={project.endDate}
                                  placeholder="Pilih bulan & tahun"
                                  className="bg-background border-border focus:ring-primary/50 cursor-pointer pr-10 focus:ring-1"
                                />
                                <CalendarIcon className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                              </div>
                            }
                          />
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthPicker
                              selectedMonth={
                                project.endDate
                                  ? parse(
                                      project.endDate,
                                      "MMMM yyyy",
                                      new Date(),
                                      { locale: id },
                                    )
                                  : undefined
                              }
                              onMonthSelect={(date) => {
                                if (date) {
                                  updateProject(project.id, {
                                    endDate: format(date, "MMMM yyyy", {
                                      locale: id,
                                    }),
                                  });
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-muted-foreground text-xs font-medium uppercase">
                            Deskripsi Projek
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = project.description || [];
                              updateProject(project.id, {
                                description: [...current, ""],
                              });
                            }}
                            className="hover:border-primary/50 hover:bg-primary/5 h-7 gap-1 px-2 text-[10px] font-semibold transition-all"
                          >
                            <Plus className="h-3 w-3" />
                            Tambah Poin
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {(project.description || []).map((bullet, idx) => (
                            <div
                              key={idx}
                              className="group flex items-start gap-2"
                            >
                              <div className="bg-primary/20 text-primary mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-none text-[10px] font-bold">
                                {idx + 1}
                              </div>
                              <div className="relative flex-1">
                                <textarea
                                  value={bullet}
                                  onChange={(e) => {
                                    const newDesc = [
                                      ...(project.description || []),
                                    ];
                                    newDesc[idx] = e.target.value;
                                    updateProject(project.id, {
                                      description: newDesc,
                                    });
                                  }}
                                  placeholder="Jelaskan kontribusi atau fitur utama projek ini..."
                                  className="bg-background border-border focus:border-primary/50 custom-scrollbar min-h-15 w-full resize-none rounded-none border p-3 text-sm transition-all focus:ring-0"
                                  rows={2}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newDesc = [
                                    ...(project.description || []),
                                  ];
                                  newDesc.splice(idx, 1);
                                  updateProject(project.id, {
                                    description: newDesc,
                                  });
                                }}
                                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground h-8 w-8 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                          {(project.description || []).length === 0 && (
                            <p className="text-muted-foreground py-2 text-center text-xs italic">
                              Belum ada deskripsi yang ditambahkan.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {content.projects.length === 0 && (
                <EmptyState message="Belum ada projek" onAdd={addProject} />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Skills */}
        <AccordionItem
          value="skills"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-foreground font-semibold tracking-tight">
                Skills
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Skills (Pisahkan dengan koma)
              </Label>
              <Textarea
                value={content.skills.join(", ")}
                onChange={(e) =>
                  updateSkills(e.target.value.split(",").map((s) => s.trim()))
                }
                className="bg-background border-border focus:border-primary focus:ring-primary min-h-32 py-3 transition-all focus:ring-1"
                placeholder="React, Next.js, TypeScript, Tailwind CSS..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Visual Settings */}
        <AccordionItem
          value="style"
          className="bg-card border-border hover:border-primary/20 overflow-hidden rounded-none border shadow-sm transition-all"
        >
          <AccordionTrigger className="data-[state=open]:bg-muted/30 px-5 py-5 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-none">
                <Settings2 className="h-4 w-4" />
              </div>
              <span className="text-foreground font-semibold tracking-tight">
                Pengaturan Visual
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pt-2 pb-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Jenis Font
                </Label>
                <div className="relative">
                  <select
                    value={content.style?.fontFamily || "Helvetica"}
                    onChange={(e) =>
                      updateStyle({ fontFamily: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary focus:ring-primary h-11 w-full appearance-none rounded-none border px-4 py-2 text-sm transition-all focus:ring-1"
                  >
                    <option value="Calibri">Calibri</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Ukuran Font
                </Label>
                <div className="flex gap-2">
                  {["text-xs", "text-sm", "text-base"].map((size) => (
                    <Button
                      key={size}
                      variant={
                        content.style?.fontSize === size ? "default" : "outline"
                      }
                      className="h-11 flex-1 transition-all"
                      onClick={() => updateStyle({ fontSize: size })}
                    >
                      {size === "text-xs"
                        ? "Kecil"
                        : size === "text-sm"
                          ? "Sedang"
                          : "Besar"}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
                  <Languages className="h-3.5 w-3.5" /> Bahasa Resume (PDF)
                </Label>
                <div className="flex gap-2">
                  {[
                    { id: "id", label: "Indonesia" },
                    { id: "en", label: "Inggris" },
                  ].map((lang) => (
                    <Button
                      key={lang.id}
                      variant={
                        (content.style?.language || "id") === lang.id
                          ? "default"
                          : "outline"
                      }
                      className="h-11 flex-1 transition-all"
                      onClick={() =>
                        updateStyle({ language: lang.id as "id" | "en" })
                      }
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
                <p className="text-muted-foreground text-[10px] italic">
                  * Ini akan menentukan bahasa yang digunakan pada tampilan PDF
                  akhir.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function EmptyState({
  message,
  onAdd,
}: {
  message: string;
  onAdd: () => void;
}) {
  return (
    <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-none border-2 border-dashed py-10">
      <p className="text-surface-400 mb-4">{message}</p>
      <Button
        onClick={onAdd}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah Data
      </Button>
    </div>
  );
}
