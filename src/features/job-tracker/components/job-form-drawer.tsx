"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Briefcase,
  Building2,
  CalendarDays,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Loader2,
  MapPin,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormDatePicker } from "@/components/shared/form-date-picker";
import { FormFieldLabel } from "@/components/shared/form-field-label";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createJobAction,
  getUserResumesAction,
  updateJobAction,
} from "@/features/job-tracker/actions";
import {
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
} from "@/features/job-tracker/constants";
import {
  type JobApplication,
  type JobStatus,
} from "@/features/job-tracker/types";
import { cn } from "@/lib/utils";
import { triggerSuccessConfetti } from "@/lib/utils/confetti";

import { type JobApplicationFormValues, jobApplicationSchema } from "../schemas";

import { JobAiAssistant } from "./job-ai-assistant";
import { ResumeSelectorDialog } from "./resume-selector-dialog";


interface JobFormDrawerProps {
  job: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onDelete?: (job: JobApplication) => void;
  trackerId?: string | null;
}

export function JobFormDrawer({
  job,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
  trackerId,
}: JobFormDrawerProps) {
  const _queryClient = useQueryClient();
  const [isResumeSelectorOpen, setIsResumeSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("detail");
  const isEdit = !!job;

  const mutation = useMutation({
    mutationFn: (values: JobApplicationFormValues) => {
      const payload = {
        ...values,
        appliedDate: values.appliedDate
          ? values.appliedDate.toISOString()
          : undefined,
        interviewDate: values.interviewDate
          ? values.interviewDate.toISOString()
          : undefined,
      };
      if (isEdit && job) {
        return updateJobAction(job.id, payload);
      }
      return createJobAction({
        ...payload,
        trackerId: values.trackerId || trackerId,
      });
    },
    onSuccess: (data, variables) => {
      toast.success(isEdit ? "Lamaran diperbarui" : "Lamaran ditambahkan");

      if (variables.status === "penawaran") {
        triggerSuccessConfetti();
      }

      if (!isEdit) form.reset();
      if (!isEdit) onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan data");
    },
  });

  const form = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      company: "",
      position: "",
      location: "",
      status: "dilamar",
      type: "full-time",
      jobUrl: "",
      salary: "",
      appliedDate: new Date(),
      interviewDate: undefined,
      description: "",
      trackerId: trackerId || null,
    },
  });

  const { data: userResumes = [] } = useQuery({
    queryKey: ["user-resumes"],
    queryFn: () => getUserResumesAction(),
    enabled: open,
  });

  useEffect(() => {
    if (job) {
      form.reset({
        company: job.company,
        position: job.position,
        location: job.location || "",
        status: job.status as any,
        type: job.type as any,
        jobUrl: job.jobUrl || "",
        salary: job.salary || "",
        resumeId: job.resumeId || null,
        appliedDate: job.appliedDate ? new Date(job.appliedDate) : new Date(),
        interviewDate: job.interviewDate
          ? new Date(job.interviewDate)
          : undefined,
        description: job.description || "",
      });
    } else {
      form.reset({
        company: "",
        position: "",
        location: "",
        status: "dilamar",
        type: "full-time",
        jobUrl: "",
        salary: "",
        resumeId: null,
        appliedDate: new Date(),
        interviewDate: undefined,
        description: "",
      });
    }
    // Reset to detail tab when opening
    if (open) setActiveTab("detail");
  }, [job, form, open]);

  const onSubmit = (values: JobApplicationFormValues) => {
    mutation.mutate(values);
  };

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(newOpen) => {
          // Prevent drawer from closing if resume selector is open
          if (!newOpen && isResumeSelectorOpen) return;
          onOpenChange(newOpen);
        }}
        direction="right"
      >
        <DrawerContent className="flex h-full w-full flex-col data-[vaul-drawer-direction=right]:sm:max-w-2xl">
          <DrawerHeader className="shrink-0 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-xl font-bold">
                  {isEdit ? "Detail Lamaran" : "Tambah Lamaran"}
                </DrawerTitle>
                <DrawerDescription>
                  {isEdit
                    ? "Informasi lengkap mengenai lamaran kerja Anda."
                    : "Catat detail lamaran kerja baru kamu."}
                </DrawerDescription>
              </div>
              {isEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => job && onDelete?.(job)}
                  className="text-destructive hover:bg-destructive/10 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DrawerHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col overflow-hidden"
          >
            {isEdit && (
              <div className="px-5 pt-4">
                <TabsList
                  variant="line"
                  className="h-10 w-full justify-start rounded-none border-b"
                >
                  <TabsTrigger
                    value="detail"
                    className="flex items-center gap-2 px-4"
                  >
                    <FileText className="h-3.5 w-3.5" /> Detail
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai"
                    className="flex items-center gap-2 px-4"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> AI Asisten
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            <TabsContent
              value="detail"
              className="m-0 flex flex-1 flex-col overflow-hidden"
            >
              <form
                id="job-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="custom-scrollbar flex-1 overflow-y-auto px-5 py-6"
              >
                {isEdit && job && (
                  <div className="bg-muted/30 border-border/50 mb-6 flex items-center justify-between rounded-none border p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-none">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                          Status Saat Ini
                        </p>
                        <p className="text-sm font-semibold capitalize">
                          {JOB_STATUS_LABELS[job.status as JobStatus]}
                        </p>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Update: {format(new Date(job.updatedAt), "d MMM yyyy")}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormFieldLabel
                      icon={<Building2 className="h-3.5 w-3.5" />}
                    >
                      Nama Perusahaan
                    </FormFieldLabel>
                    <Input
                      {...form.register("company")}
                      className="bg-background"
                      placeholder="Google, Tokopedia, dll..."
                    />
                  </div>

                  <div className="space-y-2">
                    <FormFieldLabel
                      icon={<Briefcase className="h-3.5 w-3.5" />}
                    >
                      Posisi Pekerjaan
                    </FormFieldLabel>
                    <Input
                      {...form.register("position")}
                      className="bg-background"
                      placeholder="Frontend Developer, dll..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormFieldLabel
                        icon={<MapPin className="h-3.5 w-3.5" />}
                      >
                        Lokasi
                      </FormFieldLabel>
                      <Input
                        {...form.register("location")}
                        className="bg-background"
                        placeholder="Jakarta, Remote..."
                      />
                    </div>

                    <div className="space-y-2">
                      <FormFieldLabel
                        icon={<CalendarDays className="h-3.5 w-3.5" />}
                      >
                        Tipe Kerja
                      </FormFieldLabel>
                      <select
                        {...form.register("type")}
                        className="border-input bg-background focus-visible:ring-primary flex h-9 w-full rounded-none border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                      >
                        {Object.entries(JOB_TYPE_LABELS).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormFieldLabel>Status Lamaran</FormFieldLabel>
                    <select
                      {...form.register("status")}
                      className="border-input bg-background focus-visible:ring-primary flex h-9 w-full rounded-none border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                    >
                      {Object.entries(JOB_STATUS_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormFieldLabel
                        icon={<DollarSign className="h-3.5 w-3.5" />}
                      >
                        Estimasi Gaji
                      </FormFieldLabel>
                      <Input
                        {...form.register("salary")}
                        className="bg-background"
                        placeholder="10jt - 15jt"
                      />
                    </div>

                    <div className="space-y-2">
                      <FormFieldLabel
                        icon={<Globe className="h-3.5 w-3.5" />}
                      >
                        Link Lowongan
                      </FormFieldLabel>
                      <div className="flex gap-2">
                        <Input
                          {...form.register("jobUrl")}
                          className="bg-background"
                          placeholder="https://..."
                        />
                        {isEdit && job?.jobUrl && (
                          <a
                            href={job.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "icon",
                              }),
                              "shrink-0",
                            )}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormFieldLabel
                      icon={<FileText className="h-3.5 w-3.5" />}
                    >
                      Resume yang Digunakan
                    </FormFieldLabel>
                    <Controller
                      control={form.control}
                      name="resumeId"
                      render={({ field }) => {
                        const selectedResume = userResumes.find(
                          (r: any) => r.id === field.value,
                        );
                        return (
                          <>
                            <button
                              type="button"
                              onClick={() => setIsResumeSelectorOpen(true)}
                              className={cn(
                                "bg-background hover:border-primary/50 flex w-full items-center justify-between border px-4 py-3 text-left transition-all",
                                !field.value &&
                                  "text-muted-foreground border-dashed",
                              )}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div
                                  className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-none",
                                    field.value
                                      ? "bg-primary/10 text-primary"
                                      : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold">
                                    {selectedResume?.title || "Pilih Resume"}
                                  </p>
                                  {selectedResume?.atsScore && (
                                    <p className="text-primary flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                                      <Sparkles className="h-3 w-3" />{" "}
                                      {selectedResume.atsScore}% ATS Score
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-muted-foreground border-muted-foreground/30 hover:bg-muted shrink-0 border px-2 py-1 text-[10px] font-bold tracking-tighter uppercase transition-colors">
                                {field.value ? "Ganti" : "Pilih"}
                              </div>
                            </button>
                          </>
                        );
                      }}
                    />
                    {userResumes.length === 0 && (
                      <p className="text-muted-foreground text-[10px]">
                        Kamu belum memiliki resume.{" "}
                        <a
                          href="/documents/resumes"
                          className="text-primary font-bold hover:underline"
                        >
                          Buat sekarang?
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormFieldLabel
                        icon={<CalendarDays className="h-3.5 w-3.5" />}
                      >
                        Tanggal Lamar
                      </FormFieldLabel>
                      <Controller
                        control={form.control}
                        name="appliedDate"
                        render={({ field }) => (
                          <FormDatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Pilih tanggal"
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormFieldLabel
                        icon={<CalendarDays className="h-3.5 w-3.5" />}
                      >
                        Jadwal Interview
                      </FormFieldLabel>
                      <Controller
                        control={form.control}
                        name="interviewDate"
                        render={({ field }) => (
                          <FormDatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Pilih tanggal"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormFieldLabel>Deskripsi Pekerjaan</FormFieldLabel>
                    <Textarea
                      {...form.register("description")}
                      placeholder="Tempel Job Description di sini untuk analisa AI..."
                      className="bg-background min-h-48 rounded-none"
                    />
                  </div>
                </div>
              </form>
            </TabsContent>

            {isEdit && job && (
              <TabsContent
                value="ai"
                className="custom-scrollbar m-0 flex-1 overflow-y-auto"
              >
                <JobAiAssistant
                  job={job}
                  selectedResume={userResumes.find(
                    (r) => r.id === form.watch("resumeId"),
                  )}
                />
              </TabsContent>
            )}
          </Tabs>

          {activeTab === "detail" && (
            <div className="shrink-0 bg-transparent p-5 pb-8">
              <Button
                type="submit"
                form="job-form"
                className="h-11 w-full text-sm font-bold"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {isResumeSelectorOpen && (
        <ResumeSelectorDialog
          resumes={userResumes}
          open={isResumeSelectorOpen}
          onOpenChange={setIsResumeSelectorOpen}
          selectedId={form.watch("resumeId")}
          onSelect={(id) => form.setValue("resumeId", id)}
        />
      )}
    </>
  );
}
