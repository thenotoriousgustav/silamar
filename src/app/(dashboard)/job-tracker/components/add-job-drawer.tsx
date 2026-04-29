"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  Globe,
  Building2,
  Briefcase,
  DollarSign,
  Calendar as CalendarDays,
  Loader2,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
  type JobType,
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

interface AddJobDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddJobDrawer({
  open,
  onOpenChange,
  onSuccess,
}: AddJobDrawerProps) {
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Gagal menyimpan lamaran");
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      position: "",
      location: "",
      status: "dilamar",
      type: "full-time",
      jobUrl: "",
      salary: "",
      appliedDate: new Date(),
      notes: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="max-w-xl">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-xl font-bold">
            Tambah Lamaran Kerja
          </DrawerTitle>
          <DrawerDescription>
            Catat detail lamaran kerja kamu untuk memantau progressnya.
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="custom-scrollbar max-h-[calc(100vh-100px)] space-y-6 overflow-y-auto px-5 py-6"
        >
          {/* Main Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
              >
                <Building2 className="h-3.5 w-3.5" /> Nama Perusahaan
              </Label>
              <Input
                id="company"
                placeholder="Misal: Google, Gojek, Tokopedia..."
                {...form.register("company")}
                className="bg-background"
              />
              {form.formState.errors.company && (
                <p className="text-destructive text-[10px] font-medium tracking-tight uppercase">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
              >
                <MapPin className="h-3.5 w-3.5" /> Lokasi (Opsional)
              </Label>
              <Input
                id="location"
                placeholder="Misal: Jakarta, Remote..."
                {...form.register("location")}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="position"
                className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
              >
                <Briefcase className="h-3.5 w-3.5" /> Posisi Pekerjaan
              </Label>
              <Input
                id="position"
                placeholder="Misal: Senior Frontend Developer..."
                {...form.register("position")}
                className="bg-background"
              />
              {form.formState.errors.position && (
                <p className="text-destructive text-[10px] font-medium tracking-tight uppercase">
                  {form.formState.errors.position.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
              >
                Status
              </Label>
              <select
                id="status"
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

            <div className="space-y-2">
              <Label
                htmlFor="type"
                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
              >
                Tipe Kerja
              </Label>
              <select
                id="type"
                {...form.register("type")}
                className="border-input bg-background focus-visible:ring-primary flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
              >
                {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="jobUrl"
                className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
              >
                <Globe className="h-3.5 w-3.5" /> Link Lowongan
              </Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="https://linkedin.com/jobs/..."
                {...form.register("jobUrl")}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="salary"
                className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
              >
                <DollarSign className="h-3.5 w-3.5" /> Estimasi Gaji (Opsional)
              </Label>
              <Input
                id="salary"
                placeholder="Misal: 15jt - 20jt"
                {...form.register("salary")}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <CalendarDays className="h-3.5 w-3.5" /> Tanggal Lamar
              </Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "bg-background w-full justify-start text-left font-normal",
                        !form.watch("appliedDate") && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("appliedDate") ? (
                        format(form.watch("appliedDate") as Date, "PPP", {
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
                    selected={form.watch("appliedDate")}
                    onSelect={(date) => {
                      if (date) form.setValue("appliedDate", date);
                    }}
                    defaultMonth={form.watch("appliedDate")}
                    required
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
              >
                Catatan
              </Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan detail penting seperti nama HR, tahap interview, dll..."
                {...form.register("notes")}
                className="bg-background min-h-24"
              />
            </div>
          </div>

          <div className="bg-popover sticky bottom-0 mt-auto border-t pt-4">
            <Button
              type="submit"
              className="h-11 w-full text-sm font-bold"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Lamaran"
              )}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
