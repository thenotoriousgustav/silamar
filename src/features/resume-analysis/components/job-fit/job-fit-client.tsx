"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  Clock,
  Eye,
  History,
  Loader2,
  Monitor,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useHeaderDispatch } from "@/components/providers/header-provider";
import { SplitViewLayout } from "@/components/shared/split-view-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJobsForSelectAction } from "@/features/cover-letters-list/actions/get-jobs-for-select";
import { getUserResumesAction } from "@/features/job-tracker/actions";
import type { ResumeContent } from "@/types/resume";

import { getJobFitHistory } from "../../actions/get-job-fit-history";
import type { JobFitDTO } from "../../schemas/job-fit";

import { JobFitApplyStrategy } from "./job-fit-apply-strategy";
import { JobFitBreakdown } from "./job-fit-breakdown";
import { JobFitKeywords } from "./job-fit-keywords";
import {
  JobFitLanding,
  type JobFitFormState,
  type ResumeOption,
} from "./job-fit-landing";
import { JobFitRecommendations } from "./job-fit-recommendations";
import { JobFitRedFlags } from "./job-fit-red-flags";
import { JobFitResumePreview } from "./job-fit-resume-preview";
import { JobFitSkills } from "./job-fit-skills";
import { JobFitVerdict } from "./job-fit-verdict";

interface JobFitClientProps {
  initialResumeId?: string;
  initialJobId?: string;
}

const initialForm: JobFitFormState = {
  resumeId: "",
  jobSource: "manual",
  selectedJobId: "",
  jobTitle: "",
  company: "",
  jobDescription: "",
};

const decisionLabel = {
  strong_fit: "Sangat Cocok",
  good_fit: "Cocok",
  stretch: "Stretch",
  poor_fit: "Kurang Cocok",
  not_fit: "Tidak Cocok",
} as const;

const decisionPillBg = {
  strong_fit: "bg-emerald-500/10 text-emerald-600",
  good_fit: "bg-emerald-500/10 text-emerald-600",
  stretch: "bg-amber-500/10 text-amber-600",
  poor_fit: "bg-orange-500/10 text-orange-600",
  not_fit: "bg-red-500/10 text-red-600",
} as const;

export function JobFitClient({
  initialResumeId,
  initialJobId,
}: JobFitClientProps) {
  const [form, setForm] = useState<JobFitFormState>({
    ...initialForm,
    resumeId: initialResumeId ?? "",
    jobSource: initialJobId ? "tracker" : "manual",
    selectedJobId: initialJobId ?? "",
  });
  const [result, setResult] = useState<JobFitDTO | null>(null);
  const [hasInitializedResult, setHasInitializedResult] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "form" | "preview">(
    "split",
  );
  const queryClient = useQueryClient();
  const { setTitle, setActions } = useHeaderDispatch();

  // Fetch resumes
  const { data: userResumes = [], isLoading: isLoadingResumes } = useQuery({
    queryKey: ["user-resumes"],
    queryFn: () => getUserResumesAction(),
  });

  // Fetch tracked jobs
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs-for-select"],
    queryFn: () => getJobsForSelectAction(),
  });

  // Fetch job-fit history scoped to resume (and optionally job)
  const historyKey = [
    "job-fit-history",
    form.resumeId,
    form.selectedJobId || null,
  ];
  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: historyKey,
    enabled: !!form.resumeId,
    queryFn: async () => {
      const res = await getJobFitHistory({
        resumeId: form.resumeId,
        jobId: form.selectedJobId || undefined,
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  // Auto-select first resume if none provided
  useEffect(() => {
    if (!form.resumeId && userResumes.length > 0) {
      setForm((f) => ({ ...f, resumeId: userResumes[0].id }));
    }
  }, [userResumes, form.resumeId]);

  // Hydrate from initialJobId once jobs load
  useEffect(() => {
    if (
      form.jobSource === "tracker" &&
      form.selectedJobId &&
      !form.jobDescription &&
      jobs.length > 0
    ) {
      const j = jobs.find((x) => x.id === form.selectedJobId);
      if (j) {
        setForm((f) => ({
          ...f,
          jobTitle: j.position,
          company: j.company,
          jobDescription: j.description ?? "",
        }));
      }
    }
  }, [jobs, form.jobSource, form.selectedJobId, form.jobDescription]);

  // Auto-load latest analysis on first arrival when one already exists for
  // this resume + job combination.
  useEffect(() => {
    if (hasInitializedResult || isLoadingHistory) return;
    if (history.length > 0 && initialJobId) {
      const latest = history[0];
      setResult(latest.result);
      // Hydrate form context too so header shows job info.
      setForm((f) => ({
        ...f,
        jobTitle: latest.jobTitle ?? f.jobTitle,
        company: latest.company ?? f.company,
        jobDescription: latest.result ? f.jobDescription : f.jobDescription,
      }));
    }
    setHasInitializedResult(true);
  }, [history, isLoadingHistory, hasInitializedResult, initialJobId]);

  const resumeOptions: ResumeOption[] = userResumes.map((r) => ({
    id: r.id,
    title: r.title,
    atsScore: r.atsScore,
  }));

  const selectedResume = userResumes.find((r) => r.id === form.resumeId);

  const analyzeMutation = useMutation({
    mutationFn: async (): Promise<JobFitDTO> => {
      const res = await fetch("/api/resume/analyze-job-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: form.resumeId,
          jobTitle: form.jobTitle || undefined,
          company: form.company || undefined,
          jobDescription: form.jobDescription,
          jobId: form.selectedJobId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Gagal menganalisis kecocokan");
      }
      // Action returns { id, data } now
      const payload = json.data as { id: string; data: JobFitDTO };
      return payload.data;
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["job-fit-history"] });
      const verdict = data.verdict.decision;
      if (verdict === "strong_fit" || verdict === "good_fit") {
        toast.success("Resume kamu cocok untuk pekerjaan ini! 🎉");
      } else if (verdict === "stretch") {
        toast.warning("Cocok dengan beberapa penyesuaian.");
      } else {
        toast.error("Resume kurang cocok untuk pekerjaan ini.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Terjadi kesalahan. Coba lagi.");
    },
  });

  const backUrl = "/dashboard";

  // Header injection
  useEffect(() => {
    if (!result) {
      setTitle("");
      setActions(null);
      return;
    }

    setTitle(
      <div className="flex items-center gap-3">
        <Link href={backUrl}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <span className="text-muted-foreground hidden text-xs sm:inline">
          {form.jobTitle || "Analisis Kecocokan"}
          {form.company && ` · ${form.company}`}
        </span>
      </div>,
    );

    setActions(
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View toggles desktop */}
        <div className="hidden lg:block">
          <Tabs
            value={viewMode}
            onValueChange={(v) =>
              setViewMode(v as "split" | "form" | "preview")
            }
          >
            <TabsList className="bg-muted border-border h-9">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                <Monitor className="mr-1.5 h-3.5 w-3.5" />
                Analisis
              </TabsTrigger>
              <TabsTrigger
                value="split"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                Split
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile toggles */}
        <div className="lg:hidden">
          <Tabs
            value={viewMode === "split" ? "form" : viewMode}
            onValueChange={(v) =>
              setViewMode(v as "split" | "form" | "preview")
            }
          >
            <TabsList className="bg-muted border-border h-9">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                Analisis
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="bg-border h-5 w-px" />

        {history.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 px-3">
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Riwayat</span>
                <span className="bg-muted text-muted-foreground rounded-full px-1.5 text-[9px] font-bold">
                  {history.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="text-[10px] font-bold tracking-wider uppercase">
                Riwayat Analisis Kecocokan
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="custom-scrollbar max-h-72 overflow-y-auto">
                {history.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => {
                      setResult(item.result);
                      setForm((f) => ({
                        ...f,
                        jobTitle: item.jobTitle ?? f.jobTitle,
                        company: item.company ?? f.company,
                      }));
                    }}
                    className="flex flex-col items-start gap-1 py-2"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="truncate text-xs font-bold">
                        {item.jobTitle || "Tanpa Judul"}
                        {item.company && (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            · {item.company}
                          </span>
                        )}
                      </span>
                      <span
                        className={`shrink-0 px-1.5 py-0 text-[9px] font-bold ${decisionPillBg[item.decision]}`}
                      >
                        {item.matchScore}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2">
                      <span
                        className={`px-1 py-0 text-[9px] font-bold ${decisionPillBg[item.decision]}`}
                      >
                        {decisionLabel[item.decision]}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1 text-[9px]">
                        <Clock className="h-2.5 w-2.5" />
                        {format(new Date(item.createdAt), "d MMM yyyy HH:mm", {
                          locale: idLocale,
                        })}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="default"
          size="sm"
          className="h-8 gap-2 px-3 text-xs font-bold"
          onClick={() => setResult(null)}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Analisis Baru</span>
        </Button>

        <div className="bg-border h-5 w-px" />

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ${
            result.matchScore >= 70
              ? "bg-emerald-500/10 text-emerald-600"
              : result.matchScore >= 40
                ? "bg-amber-500/10 text-amber-600"
                : "bg-red-500/10 text-red-600"
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          {result.matchScore}/100
        </div>
      </div>,
    );

    return () => {
      setTitle("");
      setActions(null);
    };
  }, [
    result,
    history,
    viewMode,
    setTitle,
    setActions,
    form.jobTitle,
    form.company,
  ]);

  // Loading state during mutation
  if (analyzeMutation.isPending) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">
              AI sedang membandingkan resume dengan pekerjaan...
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Proses ini memerlukan waktu 15-30 detik
            </p>
          </div>
          <div className="bg-muted h-1.5 w-64 overflow-hidden">
            <div
              className="bg-primary h-full animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Landing
  if (!result) {
    return (
      <JobFitLanding
        resumes={resumeOptions}
        jobs={jobs}
        isLoadingResumes={isLoadingResumes}
        isLoadingJobs={isLoadingJobs}
        form={form}
        onChange={setForm}
        onSubmit={() => analyzeMutation.mutate()}
        isSubmitting={analyzeMutation.isPending}
        backUrl={backUrl}
        history={history}
        onSelectHistory={(item) => {
          setResult(item.result);
          setForm((f) => ({
            ...f,
            jobTitle: item.jobTitle ?? f.jobTitle,
            company: item.company ?? f.company,
          }));
        }}
      />
    );
  }

  // Result split view
  const analysisPanel = (
    <div className="custom-scrollbar h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <JobFitVerdict data={result} />
        <JobFitBreakdown data={result} />
        <JobFitSkills data={result.skillsAnalysis} />
        <JobFitKeywords data={result.keywordMatch} />
        <JobFitRedFlags data={result.redFlags} />
        <JobFitRecommendations data={result.recommendations} />
        <JobFitApplyStrategy
          data={result.applyStrategy}
          shouldApply={result.verdict.shouldApply}
        />
      </div>
    </div>
  );

  const previewPanel = selectedResume?.content ? (
    <JobFitResumePreview
      content={selectedResume.content as ResumeContent}
      data={result}
    />
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground text-sm">Memuat preview resume...</p>
    </div>
  );

  return (
    <SplitViewLayout
      viewMode={viewMode}
      formPanel={analysisPanel}
      previewPanel={previewPanel}
    />
  );
}
