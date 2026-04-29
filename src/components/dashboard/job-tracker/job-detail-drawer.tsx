"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  Building2,
  Briefcase,
  MapPin,
  Globe,
  DollarSign,
  CalendarDays,
  Loader2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
  type JobStatus,
  type JobApplication,
} from "@/types/job";

const formSchema = z.object({
  company: z.string().min(1, "Nama perusahaan wajib diisi"),
  position: z.string().min(1, "Posisi pekerjaan wajib diisi"),
  location: z.string().optional(),
  status: z.enum(["dilamar", "interview", "penawaran", "ditolak"]),
  type: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
  ]),
  jobUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  salary: z.string().optional(),
  appliedDate: z.date().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JobDetailDrawerProps {
  job: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onDelete?: (job: JobApplication) => void;
}

export function JobDetailDrawer({
  job,
  open,
  onOpenChange,
  onSuccess,
  onDelete: onDeleteProp,
}: JobDetailDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
        appliedDate: job.appliedDate ? new Date(job.appliedDate) : new Date(),
        notes: job.notes || "",
      });
      setIsEditing(false);
    }
  }, [job, form]);

  const onSubmit = async (values: FormValues) => {
    if (!job) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job.id, ...values }),
      });

      if (!response.ok) throw new Error("Gagal memperbarui lamaran");

      toast.success("Lamaran berhasil diperbarui");
      setIsEditing(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat memperbarui data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!job) return;
    // We'll let the parent handle the actual deletion for consistency with the Kanban/Table view
    // or we can keep it here but use a proper UI.
    // For now, let's just use the same confirmation logic if possible.
  };

  if (!job) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="max-w-xl">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold">
                Detail Lamaran
              </DrawerTitle>
              <DrawerDescription>
                Informasi lengkap mengenai lamaran kerja Anda.
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 text-xs"
                >
                  Edit Data
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => job && onDeleteProp?.(job)}
                className="text-destructive hover:bg-destructive/10 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DrawerHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="custom-scrollbar max-h-[calc(100vh-100px)] space-y-6 overflow-y-auto px-5 py-6"
        >
          {/* Status Badge (Static View) */}
          {!isEditing && (
            <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-2xl border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Status Lamaran
                  </p>
                  <p className="text-sm font-semibold capitalize">
                    {JOB_STATUS_LABELS[job.status as JobStatus]}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                Terakhir diupdate:{" "}
                {job.updatedAt
                  ? format(new Date(job.updatedAt), "d MMM yyyy")
                  : "-"}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Building2 className="h-3.5 w-3.5" /> Nama Perusahaan
              </Label>
              {isEditing ? (
                <Input
                  {...form.register("company")}
                  className="bg-background"
                />
              ) : (
                <div className="text-sm font-medium">{job.company}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Briefcase className="h-3.5 w-3.5" /> Posisi Pekerjaan
              </Label>
              {isEditing ? (
                <Input
                  {...form.register("position")}
                  className="bg-background"
                />
              ) : (
                <div className="text-sm font-medium">{job.position}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <MapPin className="h-3.5 w-3.5" /> Lokasi
                </Label>
                {isEditing ? (
                  <Input
                    {...form.register("location")}
                    className="bg-background"
                  />
                ) : (
                  <div className="text-sm">{job.location || "-"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <CalendarDays className="h-3.5 w-3.5" /> Tipe Kerja
                </Label>
                {isEditing ? (
                  <select
                    {...form.register("type")}
                    className="border-input bg-background focus-visible:ring-primary flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                  >
                    {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm capitalize">{job.type}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  Status
                </Label>
                <select
                  {...form.register("status")}
                  className="border-input bg-background focus-visible:ring-primary flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                >
                  {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <DollarSign className="h-3.5 w-3.5" /> Estimasi Gaji
                </Label>
                {isEditing ? (
                  <Input
                    {...form.register("salary")}
                    className="bg-background"
                  />
                ) : (
                  <div className="text-sm">{job.salary || "-"}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  Tanggal Lamar
                </Label>
                {isEditing ? (
                  <Controller
                    control={form.control}
                    name="appliedDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="outline"
                              className={cn(
                                "bg-background h-9 w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "d MMM yyyy", {
                                  locale: id,
                                })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                            </Button>
                          }
                        />
                        <PopoverContent
                          className="pointer-events-auto z-100 w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={field.value}
                            required
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                ) : (
                  <div className="text-sm">
                    {job.appliedDate
                      ? format(new Date(job.appliedDate), "d MMMM yyyy", {
                          locale: id,
                        })
                      : "-"}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <Globe className="h-3.5 w-3.5" /> Link Lowongan
              </Label>
              {isEditing ? (
                <Input
                  {...form.register("jobUrl")}
                  placeholder="https://..."
                  className="bg-background"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground max-w-50 truncate text-sm">
                    {job.jobUrl || "-"}
                  </div>
                  {job.jobUrl && (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                    >
                      Buka Lowongan <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                Catatan
              </Label>
              {isEditing ? (
                <Textarea
                  {...form.register("notes")}
                  className="bg-background min-h-32"
                />
              ) : (
                <div className="bg-muted/50 border-border/50 text-muted-foreground rounded-xl border p-4 text-sm whitespace-pre-wrap italic">
                  {job.notes || "Tidak ada catatan."}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions when editing */}
          {isEditing && (
            <div className="bg-background sticky bottom-0 flex gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditing(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-2 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
        </form>
      </DrawerContent>
    </Drawer>
  );
}
