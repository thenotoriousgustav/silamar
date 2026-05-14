"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// eslint-disable-next-line import/no-restricted-paths -- Cover letters list needs creation action
import { createEmptyCoverLetterAction } from "@/features/cover-letter-builder/actions/create-cover-letter";
import { getUserResumesAction } from "@/features/job-tracker/actions";

import { getJobsForSelectAction } from "../actions/get-jobs-for-select";
import { generateAndCreateCoverLetterAction } from "../actions/generate-cover-letter";

type Mode = "select" | "blank" | "generate" | "example";
type JobSource = "job-tracker" | "manual";

interface CreateCoverLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXAMPLE_CONTENT = {
  fullName: "Your Name",
  phone: "+62 812 3456 7890",
  email: "yourname@email.com",
  address: "Jl. Contoh No. 123",
  cityAndPostal: "Jakarta, 12345",
  recipientName: "Hiring Manager",
  companyName: "PT. Contoh Perusahaan",
  department: "Human Resources",
  recipientAddress: "Jl. Perusahaan No. 456",
  recipientCityAndPostal: "Jakarta, 67890",
  subject: "Application for Software Engineer Position",
  content: `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at PT. Contoh Perusahaan. With my background in software development and passion for building impactful products, I am confident I would be a valuable addition to your team.

In my previous role, I successfully led the development of several key features that improved user engagement by 40%. I have hands-on experience with modern web technologies including React, Node.js, and TypeScript, which align well with your technical requirements.

I am particularly drawn to PT. Contoh Perusahaan because of your commitment to innovation and your strong engineering culture. I believe my skills and enthusiasm would contribute meaningfully to your team's goals.

I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.

Sincerely,
Your Name`,
};

export function CreateCoverLetterDialog({
  open,
  onOpenChange,
}: CreateCoverLetterDialogProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("select");
  const [jobSource, setJobSource] = useState<JobSource>("job-tracker");

  // Generate form state
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [manualJobTitle, setManualJobTitle] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualJobDesc, setManualJobDesc] = useState("");
  const [tone, setTone] = useState<"formal" | "friendly" | "professional">("professional");

  // Fetch jobs for dropdown
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs-for-select"],
    queryFn: () => getJobsForSelectAction(),
    enabled: open && mode === "generate",
  });

  // Fetch resumes for dropdown
  const { data: resumes = [], isLoading: isLoadingResumes } = useQuery({
    queryKey: ["user-resumes"],
    queryFn: () => getUserResumesAction(),
    enabled: open && mode === "generate",
  });

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const selectedResume = resumes.find((r: any) => r.id === selectedResumeId);

  // Blank creation
  const blankMutation = useMutation({
    mutationFn: () => createEmptyCoverLetterAction(),
    onSuccess: (result) => {
      if (result.success) {
        onOpenChange(false);
        router.push(`/cover-letter-builder/${result.data.id}`);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => toast.error("Gagal membuat cover letter"),
  });

  // Example creation (blank with pre-filled example content)
  const exampleMutation = useMutation({
    mutationFn: async () => {
      // Create blank then redirect — the example content is pre-filled via localStorage
      const result = await createEmptyCoverLetterAction();
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        // Store example content in localStorage for the builder to pick up
        localStorage.setItem(
          `cover-letter-draft-${result.data.id}`,
          JSON.stringify({ content: EXAMPLE_CONTENT, updatedAt: new Date().toISOString() }),
        );
        onOpenChange(false);
        router.push(`/cover-letter-builder/${result.data.id}`);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => toast.error("Gagal membuat cover letter"),
  });

  // AI generation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const jobTitle = jobSource === "job-tracker" ? selectedJob?.position ?? "" : manualJobTitle;
      const company = jobSource === "job-tracker" ? selectedJob?.company ?? "" : manualCompany;
      const jobDescription = jobSource === "job-tracker" ? selectedJob?.description ?? "" : manualJobDesc;

      if (!jobTitle || !company) throw new Error("Job title and company are required");
      if (!selectedResume?.content) throw new Error("Please select a resume");

      const resumeContent =
        typeof selectedResume.content === "string"
          ? selectedResume.content
          : JSON.stringify(selectedResume.content);

      return generateAndCreateCoverLetterAction({
        jobTitle,
        company,
        jobDescription: jobDescription || undefined,
        resumeContent,
        resumeId: selectedResumeId || undefined,
        tone,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Cover letter berhasil di-generate! ✨");
        onOpenChange(false);
        router.push(`/cover-letter-builder/${result.data.id}`);
      } else {
        toast.error(result.error);
      }
    },
    onError: (error: Error) => toast.error(error.message || "Gagal generate cover letter"),
  });

  const isGenerateValid =
    selectedResumeId &&
    (jobSource === "job-tracker"
      ? !!selectedJobId
      : manualJobTitle.trim() && manualCompany.trim());

  const handleClose = () => {
    if (generateMutation.isPending || blankMutation.isPending || exampleMutation.isPending) return;
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setMode("select");
      setJobSource("job-tracker");
      setSelectedJobId("");
      setSelectedResumeId("");
      setManualJobTitle("");
      setManualCompany("");
      setManualJobDesc("");
      setTone("professional");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-background border-border max-w-lg rounded-none p-0">
        {/* Mode selection screen */}
        {mode === "select" && (
          <>
            <DialogHeader className="border-border border-b px-6 pt-6 pb-5">
              <DialogTitle className="text-lg font-bold">Buat Cover Letter</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Pilih cara membuat cover letter kamu
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 p-6">
              {/* Generate with AI */}
              <button
                onClick={() => setMode("generate")}
                className="border-border hover:border-primary/40 hover:bg-primary/5 group flex w-full items-start gap-4 border p-4 text-left transition-all"
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Generate dengan AI</p>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    AI membuat cover letter personal berdasarkan resume dan lowongan kamu
                  </p>
                  <span className="text-primary mt-1.5 inline-block text-[10px] font-bold tracking-wider uppercase">
                    1 Kredit
                  </span>
                </div>
              </button>

              {/* Blank */}
              <button
                onClick={() => blankMutation.mutate()}
                disabled={blankMutation.isPending}
                className="border-border hover:border-border/80 hover:bg-muted/50 group flex w-full items-start gap-4 border p-4 text-left transition-all disabled:opacity-50"
              >
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center">
                  {blankMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <FileText className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Dari Awal</p>
                    <ArrowRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Mulai dengan halaman kosong dan tulis sendiri
                  </p>
                </div>
              </button>

              {/* Use Example */}
              <button
                onClick={() => exampleMutation.mutate()}
                disabled={exampleMutation.isPending}
                className="border-border hover:border-border/80 hover:bg-muted/50 group flex w-full items-start gap-4 border p-4 text-left transition-all disabled:opacity-50"
              >
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center">
                  {exampleMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <BookOpen className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Gunakan Contoh</p>
                    <ArrowRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Mulai dari template yang sudah terisi dan sesuaikan sendiri
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* Generate with AI screen */}
        {mode === "generate" && (
          <>
            <DialogHeader className="border-border border-b px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMode("select")}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  ← Kembali
                </button>
              </div>
              <DialogTitle className="mt-1 text-lg font-bold">Generate dengan AI</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                AI akan membuat cover letter personal berdasarkan data kamu
              </DialogDescription>
            </DialogHeader>

            <div className="custom-scrollbar max-h-[60vh] space-y-5 overflow-y-auto px-6 py-5">
              {/* Job Source Toggle */}
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-wider uppercase">
                  Sumber Informasi Lowongan
                </Label>
                <div className="border-border grid grid-cols-2 border">
                  <button
                    onClick={() => setJobSource("job-tracker")}
                    className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-colors ${
                      jobSource === "job-tracker"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    Dari Job Tracker
                  </button>
                  <button
                    onClick={() => setJobSource("manual")}
                    className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-colors ${
                      jobSource === "manual"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Isi Manual
                  </button>
                </div>
              </div>

              {/* Job Tracker source */}
              {jobSource === "job-tracker" && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold tracking-wider uppercase">
                    Pilih Lamaran
                  </Label>
                  {isLoadingJobs ? (
                    <div className="border-border flex h-10 items-center justify-center border">
                      <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="border-border border border-dashed p-4 text-center">
                      <p className="text-muted-foreground text-xs">
                        Belum ada lamaran di Job Tracker.{" "}
                        <button
                          onClick={() => setJobSource("manual")}
                          className="text-primary underline"
                        >
                          Isi manual
                        </button>
                      </p>
                    </div>
                  ) : (
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                      <SelectTrigger className="border-border rounded-none">
                        <SelectValue placeholder="Pilih lamaran pekerjaan..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            <span className="font-medium">{job.position}</span>
                            <span className="text-muted-foreground ml-1">@ {job.company}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Preview selected job */}
                  {selectedJob && (
                    <div className="bg-muted/40 border-border space-y-1 border p-3">
                      <p className="text-xs font-semibold">{selectedJob.position} @ {selectedJob.company}</p>
                      {selectedJob.description ? (
                        <p className="text-muted-foreground line-clamp-2 text-[11px]">
                          {selectedJob.description}
                        </p>
                      ) : (
                        <p className="text-muted-foreground text-[11px] italic">
                          Tidak ada job description tersimpan
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Manual source */}
              {jobSource === "manual" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold tracking-wider uppercase">
                        Job Title <span className="text-destructive">*</span>
                      </Label>
                      <input
                        type="text"
                        value={manualJobTitle}
                        onChange={(e) => setManualJobTitle(e.target.value)}
                        placeholder="Software Engineer"
                        className="border-border bg-background placeholder:text-muted-foreground focus:border-primary w-full border px-3 py-2 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold tracking-wider uppercase">
                        Perusahaan <span className="text-destructive">*</span>
                      </Label>
                      <input
                        type="text"
                        value={manualCompany}
                        onChange={(e) => setManualCompany(e.target.value)}
                        placeholder="PT. Contoh"
                        className="border-border bg-background placeholder:text-muted-foreground focus:border-primary w-full border px-3 py-2 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold tracking-wider uppercase">
                      Job Description{" "}
                      <span className="text-muted-foreground font-normal normal-case">(opsional, tapi sangat disarankan)</span>
                    </Label>
                    <Textarea
                      value={manualJobDesc}
                      onChange={(e) => setManualJobDesc(e.target.value)}
                      placeholder="Tempel job description di sini untuk hasil yang lebih personal..."
                      rows={4}
                      className="border-border rounded-none text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Resume picker */}
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-wider uppercase">
                  Resume <span className="text-destructive">*</span>
                </Label>
                {isLoadingResumes ? (
                  <div className="border-border flex h-10 items-center justify-center border">
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="border-border border border-dashed p-4 text-center">
                    <p className="text-muted-foreground text-xs">
                      Belum ada resume. Buat resume dulu di{" "}
                      <a href="/documents/resumes" className="text-primary underline">
                        halaman Resume
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                    <SelectTrigger className="border-border rounded-none">
                      <SelectValue placeholder="Pilih resume..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {resumes.map((resume: any) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.title}
                          {resume.atsScore && (
                            <span className="text-muted-foreground ml-1 text-xs">
                              · ATS {resume.atsScore}%
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Tone picker */}
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-wider uppercase">Tone</Label>
                <div className="border-border grid grid-cols-3 border">
                  {(["formal", "professional", "friendly"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`py-2 text-xs font-semibold capitalize transition-colors ${
                        tone === t
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {t === "formal" ? "Formal" : t === "professional" ? "Profesional" : "Friendly"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-border flex items-center justify-between border-t px-6 py-4">
              <p className="text-muted-foreground text-xs">
                Menggunakan <span className="text-primary font-bold">1 kredit</span>
              </p>
              <Button
                onClick={() => generateMutation.mutate()}
                disabled={!isGenerateValid || generateMutation.isPending}
                className="gap-2"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
