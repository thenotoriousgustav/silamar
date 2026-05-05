"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTrackerAction } from "@/server/actions/job-applications";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama tracker minimal 2 karakter.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTrackerDialog({
  trigger,
}: {
  trigger?: React.ReactElement;
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      await createTrackerAction(values);
      toast.success("Tracker berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["trackers"] });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Gagal membuat tracker");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Buat Tracker Baru</DialogTitle>
            <DialogDescription>
              Beri nama untuk tracker pekerjaan baru Anda. Contoh: "Job Tracker
              2026" atau "Cari Magang".
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="tracker-name">Nama Tracker</FieldLabel>
              <Input
                id="tracker-name"
                placeholder="Masukkan nama tracker..."
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="tracker-description">
                Deskripsi (Opsional)
              </FieldLabel>
              <Input
                id="tracker-description"
                placeholder="Contoh: Fokus ke posisi frontend..."
                {...form.register("description")}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Batal</Button>} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Buat Tracker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
