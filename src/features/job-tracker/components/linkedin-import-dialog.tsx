"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2, Loader2, Sparkles } from "lucide-react";
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
import { Input } from "@/components/ui/input";

import { createJobAction, scrapeLinkedInJobAction } from "../actions";

interface LinkedInImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackerId?: string | null;
  onSuccess?: () => void;
}

export function LinkedInImportDialog({
  open,
  onOpenChange,
  trackerId,
  onSuccess,
}: LinkedInImportDialogProps) {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (linkedinUrl: string) => {
      // Step 1: Scrape LinkedIn
      const scrapeResult = await scrapeLinkedInJobAction(linkedinUrl);
      if (!scrapeResult.success) {
        throw new Error(scrapeResult.error);
      }

      // Step 2: Create job application with scraped data
      const data = scrapeResult.data;

      // Map LinkedIn type to our enum
      let jobType: "full-time" | "part-time" | "internship" | "contract" | "freelance" = "full-time";
      if (data.type) {
        const typeMap: Record<string, typeof jobType> = {
          "full-time": "full-time",
          "part-time": "part-time",
          internship: "internship",
          contract: "contract",
          freelance: "freelance",
        };
        const normalizedType = data.type.toLowerCase().replace(/\s+/g, "-");
        if (typeMap[normalizedType]) {
          jobType = typeMap[normalizedType];
        }
      }

      const createResult = await createJobAction({
        company: data.company,
        position: data.position,
        location: data.location || undefined,
        salary: data.salary || undefined,
        description: data.description || undefined,
        jobUrl: data.jobUrl || undefined,
        logoUrl: data.logoUrl || undefined,
        type: jobType,
        status: "dilamar",
        trackerId: trackerId || null,
      });

      if (!createResult.success) {
        throw new Error(createResult.error);
      }

      return createResult.data;
    },
    onSuccess: () => {
      toast.success("Lamaran dari LinkedIn berhasil ditambahkan! 🎉");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setUrl("");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal import dari LinkedIn");
    },
  });

  const handleImport = () => {
    if (!url.trim()) return;
    importMutation.mutate(url.trim());
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (importMutation.isPending) return;
      onOpenChange(v);
      if (!v) setUrl("");
    }}>
      <DialogContent className="bg-background border-border max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Link2 className="text-primary h-5 w-5" />
            Import dari LinkedIn
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Paste link lowongan LinkedIn untuk otomatis mengisi data lamaran
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/..."
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && url.trim()) {
                  e.preventDefault();
                  handleImport();
                }
              }}
              disabled={importMutation.isPending}
            />
            <p className="text-muted-foreground text-[10px]">
              Mendukung URL dengan /jobs/view/ atau ?currentJobId=
            </p>
          </div>

          {importMutation.isPending && (
            <div className="border-primary/20 bg-primary/5 flex items-center gap-3 border p-3">
              <Loader2 className="text-primary h-4 w-4 animate-spin" />
              <div>
                <p className="text-xs font-semibold">Mengambil data dari LinkedIn...</p>
                <p className="text-muted-foreground text-[10px]">Scraping job title, company, dan deskripsi</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={importMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleImport}
              disabled={!url.trim() || importMutation.isPending}
              className="gap-2"
            >
              {importMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {importMutation.isPending ? "Importing..." : "Import & Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
