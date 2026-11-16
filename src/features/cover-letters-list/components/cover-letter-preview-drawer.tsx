"use client";

import { PencilLine, X } from "lucide-react";
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
// eslint-disable-next-line import/no-restricted-paths -- Preview drawer needs cover letter preview component
import { CoverLetterPreview } from "@/features/cover-letter-builder/components/cover-letter-preview";

interface CoverLetter {
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  content: any;
}

interface CoverLetterPreviewDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  coverLetter: CoverLetter | null;
}

export function CoverLetterPreviewDrawer({
  isOpen,
  onOpenChange,
  coverLetter,
}: CoverLetterPreviewDrawerProps) {
  const router = useRouter();

  if (!coverLetter) return null;

  const handleEdit = () => {
    router.push(`/cover-letter-builder/${coverLetter.id}`);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-background border-border flex max-h-[95vh] flex-col overflow-hidden px-4 sm:px-6 data-[vaul-drawer-direction=right]:sm:max-w-2xl">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden">
          <DrawerHeader className="flex flex-row items-center justify-between border-b px-0 py-4">
            <div>
              <DrawerTitle className="text-xl font-bold">
                {coverLetter.title}
              </DrawerTitle>
              <p className="text-muted-foreground text-xs">
                {coverLetter.jobTitle} - {coverLetter.company}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleEdit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground hidden items-center gap-2 px-4 py-2 text-sm font-semibold sm:flex"
              >
                <PencilLine className="h-4 w-4" />
                Edit Surat
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden py-6">
            <CoverLetterPreview
              content={(() => {
                if (typeof coverLetter.content !== "string") {
                  return coverLetter.content;
                }
                if (!coverLetter.content.trim()) {
                  return {};
                }
                try {
                  return JSON.parse(coverLetter.content);
                } catch {
                  return {};
                }
              })()}
            />
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
