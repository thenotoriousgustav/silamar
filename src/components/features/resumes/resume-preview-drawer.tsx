"use client";

import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "@/app/(dashboard)/resume-builder/components/resume-preview";
import { PencilLine, X } from "lucide-react";

interface Resume {
  id: string;
  title: string;
  content: any;
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
      <DrawerContent className="bg-background border-border flex max-h-[95vh] flex-col overflow-hidden px-4 data-[vaul-drawer-direction=right]:sm:max-w-2xl sm:px-6">
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
