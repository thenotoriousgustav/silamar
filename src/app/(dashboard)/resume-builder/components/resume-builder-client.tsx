"use client";

import { use, useState, useEffect, useRef } from "react";
import { useResumeBuilder } from "@/hooks/use-resume-builder";
import { Save, ArrowLeft, Monitor, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  useHeader,
  useHeaderDispatch,
} from "@/components/providers/header-provider";
import { ResumeForm } from "./resume-form";
import { ResumePreview } from "./resume-preview";
import type { ResumeContent } from "@/types/resume";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateResumeAction } from "@/server/actions/documents/resumes";

interface ResumeBuilderClientProps {
  id: string;
  initialData?: {
    title: string;
    content: ResumeContent;
    updatedAt: Date | string;
  };
}

export function ResumeBuilderClient({
  id,
  initialData,
}: ResumeBuilderClientProps) {
  const router = useRouter();
  const [resumeTitle, setResumeTitle] = useState(
    initialData?.title || "Resume Tanpa Judul",
  );
  const titleRef = useRef(resumeTitle);

  const {
    content,
    isSaving,
    isDirty,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    updateExperienceList,
    removeExperience,
    addEducation,
    updateEducation,
    updateEducationList,
    removeEducation,
    addProject,
    updateProject,
    updateProjectList,
    removeProject,
    updateSkills,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    addCustomSection,
    updateCustomSection,
    updateCustomSectionList,
    removeCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    updateCustomSectionItemList,
    removeCustomSectionItem,
    updateStyle,
    updateSectionOrder,
    save,
    setContent,
    setIsDirty,
    isDirtyRef,
  } = useResumeBuilder(id, initialData?.content);

  const { setTitle, setActions } = useHeaderDispatch();

  const [viewMode, setViewMode] = useState<"split" | "form" | "preview">(
    "split",
  );
  const [jumpTarget, setJumpTarget] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { title: string; content?: ResumeContent }) =>
      updateResumeAction(id, data),
    onSuccess: (updatedResume) => {
      if (updatedResume) {
        queryClient.invalidateQueries({ queryKey: ["resumes"] });
        router.refresh();
      }
    },
  });

  // Sync title ref
  useEffect(() => {
    titleRef.current = resumeTitle;
  }, [resumeTitle]);

  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  // Handle SPA navigation and Tab Close
  useEffect(() => {
    const handleExit = () => {
      if (isDirtyRef.current) {
        // Use keepalive fetch inside save
        saveRef.current(id, titleRef.current);
      }
    };

    // Tab close
    window.addEventListener("beforeunload", handleExit);

    // SPA navigation
    return () => {
      window.removeEventListener("beforeunload", handleExit);
      // Only call handleExit on actual unmount
      handleExit();
    };
  }, [id, isDirtyRef]);

  // Local draft check (only on mount if we have server data)
  useEffect(() => {
    if (id !== "new" && initialData) {
      const localDraft = localStorage.getItem(`resume-draft-${id}`);
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

  // Set Header Title and Actions
  // 1. Initial/Cleanup effect
  useEffect(() => {
    return () => {
      setTitle("");
      setActions(null);
    };
  }, [setTitle, setActions]);

  // 2. Content update effect
  useEffect(() => {
    setTitle(
      <div className="flex items-center gap-3">
        <Link
          href="/documents/resumes"
          className="hover:bg-muted text-muted-foreground shrink-0 rounded-none p-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="bg-border h-4 w-px shrink-0" />
        <input
          type="text"
          value={resumeTitle}
          onChange={(e) => {
            setResumeTitle(e.target.value);
            setIsDirty(true);
          }}
          className="text-foreground w-48 truncate border-none bg-transparent p-0 text-sm font-semibold focus:ring-0 md:w-64"
          placeholder="Judul Resume..."
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
            const success = await save(id, resumeTitle);
            if (success) {
              queryClient.invalidateQueries({ queryKey: ["resumes"] });
              router.refresh();
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
    resumeTitle,
    isDirty,
    viewMode,
    mutation.isPending,
    mutation.mutate,
    setTitle,
    setActions,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="text-muted-foreground animate-pulse">
            Memuat data resume...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative -m-6 flex h-[calc(100vh-64px)] flex-col overflow-hidden lg:-m-8">
      {/* Builder Body */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Side: Form */}
        <div
          className={clsx(
            "border-border bg-background h-full border-r transition-all duration-500 ease-in-out",
            viewMode === "form"
              ? "w-full"
              : viewMode === "split"
                ? "w-5/10"
                : "pointer-events-none w-0 overflow-hidden opacity-0",
          )}
        >
          <ResumeForm
            content={content}
            updatePersonalInfo={updatePersonalInfo}
            addExperience={addExperience}
            updateExperience={updateExperience}
            updateExperienceList={updateExperienceList}
            removeExperience={removeExperience}
            addEducation={addEducation}
            updateEducation={updateEducation}
            updateEducationList={updateEducationList}
            removeEducation={removeEducation}
            addProject={addProject}
            updateProject={updateProject}
            updateProjectList={updateProjectList}
            removeProject={removeProject}
            updateSkills={updateSkills}
            addSkillCategory={addSkillCategory}
            updateSkillCategory={updateSkillCategory}
            removeSkillCategory={removeSkillCategory}
            addCustomSection={addCustomSection}
            updateCustomSection={updateCustomSection}
            updateCustomSectionList={updateCustomSectionList}
            removeCustomSection={removeCustomSection}
            addCustomSectionItem={addCustomSectionItem}
            updateCustomSectionItem={updateCustomSectionItem}
            updateCustomSectionItemList={updateCustomSectionItemList}
            removeCustomSectionItem={removeCustomSectionItem}
            updateStyle={updateStyle}
            updateSectionOrder={updateSectionOrder}
            jumpTarget={jumpTarget}
            onJumpEnd={() => setJumpTarget(null)}
          />
        </div>

        {/* Right Side: Preview */}
        <div
          className={clsx(
            "flex h-full flex-col items-center overflow-hidden transition-all duration-500 ease-in-out",
            viewMode === "preview"
              ? "w-full"
              : viewMode === "split"
                ? "w-5/10"
                : "pointer-events-none w-0 overflow-hidden opacity-0",
          )}
        >
          <div className="flex h-full w-full items-center justify-center p-4 lg:p-8">
            <ResumePreview
              content={content}
              onJumpToSection={(target) => {
                if (viewMode === "preview") setViewMode("split");
                setJumpTarget(target);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
