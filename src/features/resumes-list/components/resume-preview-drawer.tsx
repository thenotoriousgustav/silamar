"use client";

import { Briefcase, PencilLine, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
// eslint-disable-next-line import/no-restricted-paths -- Preview drawer needs resume preview component
import { ResumePreview } from "@/features/resume-builder/components/resume-preview";

interface Resume {
  id: string;
  title: string;
  content: any;
  jobUsages?: { id: string; position: string; company: string }[];
}

interface ResumePreviewDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resume: Resume | null;
}

export function ResumePreviewDrawer({
  isOpen,
  onOpenChange,
  resume,
}: ResumePreviewDrawerProps) {
  const router = useRouter();

  if (!resume) return null;

  const handleEdit = () => {
    router.push(`/resume-builder/${resume.id}`);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-background border-border flex h-full flex-col overflow-hidden px-4 sm:px-6 data-[vaul-drawer-direction=right]:sm:max-w-2xl">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden">
          <DrawerHeader className="flex flex-row items-center justify-between border-b px-0 py-4">
            <div>
              <DrawerTitle className="text-xl font-bold">
                {resume.title || "Preview Resume"}
              </DrawerTitle>
              <p className="text-muted-foreground text-xs">
                Review desain dan konten resume kamu sebelum melakukan perubahan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleEdit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground hidden items-center gap-2 px-4 py-2 text-sm font-semibold sm:flex"
              >
                <PencilLine className="h-4 w-4" />
                Edit Resume
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Job Usages Detail */}
          <div className="border-b px-0 py-3">
            <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
              <Briefcase className="h-3.5 w-3.5" />
              Digunakan di {resume.jobUsages?.length || 0} lamaran
            </div>
            {resume.jobUsages && resume.jobUsages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resume.jobUsages.map((job) => (
                  <div
                    key={job.id}
                    className="bg-muted border-border rounded-none border px-2.5 py-1 text-[11px]"
                  >
                    <span className="font-semibold">{job.position}</span>
                    <span className="text-muted-foreground"> · {job.company}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground/60 text-[11px] italic">
                Belum digunakan di lamaran mana pun
              </p>
            )}
          </div>

          <div className="flex-1 overflow-hidden py-6">
            <ResumePreview content={resume.content} />
          </div>

          <DrawerFooter className="border-t px-0 py-4 sm:hidden">
            <Button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex w-full items-center justify-center gap-2 py-6 font-bold"
            >
              <PencilLine className="h-4 w-4" />
              Lanjutkan Edit
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
