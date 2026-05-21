"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Eye, Loader2, Monitor, Save } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useHeaderDispatch } from "@/components/providers/header-provider";
import { SplitViewLayout } from "@/components/shared/split-view-layout";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoverLetterBuilder } from "@/features/cover-letter-builder/hooks/use-cover-letter-builder";
import { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

import { CoverLetterForm } from "./cover-letter-form";

const CoverLetterPreview = dynamic(
  () =>
    import("./cover-letter-preview").then((mod) => ({
      default: mod.CoverLetterPreview,
    })),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="bg-muted h-[600px] w-[420px] animate-pulse rounded-lg" />
      </div>
    ),
    ssr: false,
  },
);

interface CoverLetterBuilderClientProps {
  id: string;
  initialData?: {
    title: string;
    content: CoverLetterBuilderData;
    updatedAt: Date | string;
  };
}

export function CoverLetterBuilderClient({
  id,
  initialData,
}: CoverLetterBuilderClientProps) {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [coverLetterTitle, setCoverLetterTitle] = useState(
    initialData?.title || "Cover Letter Tanpa Judul",
  );
  const titleRef = useRef(coverLetterTitle);

  const {
    content,
    isSaving,
    isDirty,
    updateContent,
    updateStyle,
    save,
    setContent,
    setIsDirty,
    isDirtyRef,
  } = useCoverLetterBuilder(id, initialData?.content);

  const { setTitle, setActions } = useHeaderDispatch();
  const [viewMode, setViewMode] = useState<"split" | "form" | "preview">(
    "split",
  );

  const queryClient = useQueryClient();

  // Sync title ref
  useEffect(() => {
    titleRef.current = coverLetterTitle;
  }, [coverLetterTitle]);

  // Collapse sidebar on mount (only once)
  const hasAutoCollapsed = useRef(false);
  useEffect(() => {
    if (!hasAutoCollapsed.current) {
      setOpen(false);
      hasAutoCollapsed.current = true;
    }
  }, [setOpen]);

  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  // Handle SPA navigation and Tab Close
  useEffect(() => {
    const handleExit = () => {
      if (isDirtyRef.current) {
        saveRef.current(id, titleRef.current);
      }
    };

    window.addEventListener("beforeunload", handleExit);
    return () => {
      window.removeEventListener("beforeunload", handleExit);
      handleExit();
    };
  }, [id, isDirtyRef]);

  // Local draft check
  useEffect(() => {
    if (id !== "new" && initialData) {
      const localDraft = localStorage.getItem(`cover-letter-draft-${id}`);
      if (localDraft) {
        try {
          const { content: draftContent, updatedAt } = JSON.parse(localDraft);
          const draftDate = new Date(updatedAt);
          const serverDate = new Date(initialData.updatedAt);

          if (draftDate > serverDate) {
            toast("Draf lokal ditemukan", {
              description:
                "Kami menemukan draf yang lebih baru di perangkat ini.",
              action: {
                label: "Gunakan Draf",
                onClick: () => {
                  setContent(draftContent);
                  setIsDirty(true);
                },
              },
            });
          }
        } catch (e) {
          console.error("Failed to parse local draft:", e);
        }
      }
    }
  }, [id, initialData, setContent, setIsDirty]);

  // 1. Initial/Cleanup effect
  useEffect(() => {
    return () => {
      setTitle("");
      setActions(null);
    };
  }, [setTitle, setActions]);

  // 2. Content update effect — Set Header Title and Actions
  useEffect(() => {
    setTitle(
      <div className="flex items-center gap-3">
        <Link
          href="/documents/cover-letter"
          className="hover:bg-muted text-muted-foreground shrink-0 rounded-none p-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="bg-border h-4 w-px shrink-0" />
        <input
          type="text"
          value={coverLetterTitle}
          onChange={(e) => {
            setCoverLetterTitle(e.target.value);
            setIsDirty(true);
          }}
          className="text-foreground w-48 truncate border-none bg-transparent p-0 text-sm font-semibold focus:ring-0 md:w-64"
          placeholder="Judul Cover Letter..."
        />
        {isDirty && (
          <span className="text-primary bg-primary/10 hidden rounded-none px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase sm:inline-block">
            Belum Simpan
          </span>
        )}
      </div>,
    );

    setActions(
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Toggles (Desktop) */}
        <div className="hidden lg:block">
          <Tabs
            value={viewMode}
            onValueChange={(v) =>
              setViewMode(v as "split" | "form" | "preview")
            }
            className="w-fit"
          >
            <TabsList className="bg-muted border-border h-9">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                <Monitor className="mr-1.5 h-3.5 w-3.5" />
                Edit
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

        {/* View Toggles (Mobile) */}
        <div className="lg:hidden">
          <Tabs
            value={viewMode === "split" ? "form" : viewMode}
            onValueChange={(v) =>
              setViewMode(v as "split" | "form" | "preview")
            }
            className="w-fit"
          >
            <TabsList className="bg-muted border-border h-9">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-background px-3 text-xs"
              >
                Edit
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

        <Button
          onClick={async () => {
            const result = await save(id, coverLetterTitle);
            if (result) {
              toast.success("Cover letter berhasil disimpan");
              queryClient.invalidateQueries({ queryKey: ["cover-letters"] });

              if (id === "new" && result.id) {
                router.push(`/cover-letter-builder/${result.id}`);
              } else {
                router.refresh();
              }
            }
          }}
          disabled={!isDirty || isSaving}
          variant="secondary"
          size="sm"
          className="h-9 gap-2 px-3 sm:px-4"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">
            {isSaving ? "Menyimpan..." : "Simpan"}
          </span>
          <span className="sm:hidden">{isSaving ? "..." : "Simpan"}</span>
        </Button>
      </div>,
    );
  }, [
    coverLetterTitle,
    isDirty,
    viewMode,
    isSaving,
    id,
    save,
    router,
    setTitle,
    setActions,
    setIsDirty,
    queryClient,
  ]);

  return (
    <SplitViewLayout
      viewMode={viewMode}
      formPanel={
        <CoverLetterForm
          content={content}
          updateContent={updateContent}
          updateStyle={updateStyle}
        />
      }
      previewPanel={<CoverLetterPreview content={content} />}
    />
  );
}
