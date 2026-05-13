"use client";

import {
  BookOpenIcon,
  CertificateIcon,
  PlusIcon,
  TrophyIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { GripVertical } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import type { ResumeContent } from "@/types/resume";

import type { ResumeFormHandlers } from "../types/resume-form-handlers";

// Import Modular Sections
import { ATSDashboard } from "./form-sections/ats-dashboard";
import { CustomSection } from "./form-sections/custom-section";
import { EducationSection } from "./form-sections/education-section";
import { ExperienceSection } from "./form-sections/experience-section";
import { ItemsListSection } from "./form-sections/items-list-section";
import { PersonalInfoSection } from "./form-sections/personal-info-section";
import { ProjectSection } from "./form-sections/project-section";
import { SkillsSection } from "./form-sections/skills-section";
import { VisualSettingsSection } from "./form-sections/visual-settings-section";

interface ResumeFormProps {
  content: ResumeContent;
  handlers: ResumeFormHandlers;
  jumpTarget?: string | null;
  onJumpEnd?: () => void;
}

export function ResumeForm({
  content,
  handlers,
  jumpTarget,
  onJumpEnd,
}: ResumeFormProps) {
  const {
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    updateExperienceList,
    addEducation,
    updateEducation,
    updateEducationList,
    removeEducation,
    addProject,
    updateProject,
    updateProjectList,
    removeProject,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    updateSkills,
    addCustomSection,
    updateCustomSection,
    updateCustomSectionList,
    removeCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    updateCustomSectionItemList,
    removeCustomSectionItem,
    updatePredefinedSectionItems,
    addPredefinedSectionItem,
    updatePredefinedSectionItem,
    removePredefinedSectionItem,
    addSectionToOrder,
    updateStyle,
    updateSectionOrder,
  } = handlers;
  const [expandedItems, setExpandedItems] = useState<string[]>(["personal"]);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    feedback: string;
    criticalIssues: string[];
    missingKeywords: string[];
    readabilityScore: number;
  } | null>(null);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!jumpTarget) return;

    const [section, id] = jumpTarget.split("-");
    const sectionToExpand =
      section === "experience" ||
      section === "education" ||
      section === "projects" ||
      section === "skills" ||
      section === "custom" ||
      section === "personal"
        ? section
        : null;

    if (sectionToExpand) {
      setExpandedItems((prev) =>
        prev.includes(sectionToExpand) ? prev : [...prev, sectionToExpand],
      );

      // Wait for accordion to expand then scroll
      setTimeout(() => {
        const element = document.getElementById(jumpTarget);

        // Remove any existing highlights first
        const highlightedElements =
          document.querySelectorAll(".jump-highlight");
        highlightedElements.forEach((el) => {
          el.classList.remove(
            "ring-2",
            "ring-primary",
            "ring-offset-2",
            "jump-highlight",
          );
        });

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add highlight effect
          element.classList.add(
            "ring-2",
            "ring-primary",
            "ring-offset-2",
            "jump-highlight",
          );
          setTimeout(() => {
            element.classList.remove(
              "ring-2",
              "ring-primary",
              "ring-offset-2",
              "jump-highlight",
            );
          }, 2000);
        } else {
          // If specific item ID not found, scroll to section header
          const sectionElement = document.getElementById(`section-${section}`);
          if (sectionElement) {
            sectionElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
        onJumpEnd?.();
      }, 300);
    }
  }, [jumpTarget, onJumpEnd]);

  const optimizeMutation = useMutation({
    mutationFn: async ({
      expId,
      idx,
      text,
      type,
    }: {
      expId: string;
      idx: number;
      text: string;
      type: string;
    }) => {
      const res = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return { ...data, expId, idx };
    },
    onSuccess: (data) => {
      const currentExp = content.experience.find((e) => e.id === data.expId);
      if (currentExp) {
        const description = currentExp.description;
        if (Array.isArray(description)) {
          const currentBullets = [...description];
          currentBullets[data.idx] = {
            ...currentBullets[data.idx],
            text: data.result,
          };
          updateExperience(data.expId, { description: currentBullets });
        } else {
          updateExperience(data.expId, { description: data.result });
        }
        toast.success("Teks berhasil dioptimasi!");
      }
    },
    onSettled: () => {
      setOptimizingId(null);
    },
    onError: (error) => {
      console.error("Optimize error:", error);
      toast.error("Gagal mengoptimasi teks");
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/resume/analyze-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      setAtsResult(data);
    },
    onError: (error) => {
      console.error("ATS Error:", error);
      toast.error("Gagal menjalankan analisis ATS");
    },
  });

  const handleOptimize = (
    expId: string,
    idx: number,
    text: string,
    type: "optimize" | "quantify" | "grammar" = "optimize",
  ) => {
    if (!text || text.length < 5) {
      toast.error("Teks terlalu pendek untuk dioptimasi");
      return;
    }
    const loadingId = `${expId}-${idx}`;
    setOptimizingId(loadingId);
    optimizeMutation.mutate({ expId, idx, text, type });
  };

  const handleRunATSAnalysis = () => {
    analyzeMutation.mutate();
  };

  return (
    <div
      ref={scrollContainerRef}
      className="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto p-6"
    >
      {/* ATS & Completeness Dashboard */}
      <ATSDashboard
        content={content}
        atsResult={atsResult}
        isAnalyzing={analyzeMutation.isPending}
        onRunAnalysis={handleRunATSAnalysis}
        setAtsResult={setAtsResult}
      />

      <Accordion
        value={expandedItems}
        onValueChange={setExpandedItems}
        type="multiple"
        className="w-full space-y-4 border-none"
      >
        <div id="section-personal">
          <PersonalInfoSection
            content={content}
            updatePersonalInfo={updatePersonalInfo}
          />
        </div>

        <Sortable
          value={
            content.sectionOrder || [
              "experience",
              "education",
              "projects",
              "skills",
              "custom",
            ]
          }
          onValueChange={updateSectionOrder}
        >
          <SortableContent className="space-y-4">
            {(
              content.sectionOrder || [
                "experience",
                "education",
                "projects",
                "skills",
                "custom",
              ]
            ).map((sectionId) => (
              <SortableItem key={sectionId} value={sectionId}>
                <div className="group relative">
                  <SortableItemHandle className="absolute top-7 left-1 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="text-muted-foreground h-4 w-4 cursor-grab" />
                  </SortableItemHandle>
                  <div id={`section-${sectionId}`}>
                    {sectionId === "experience" && (
                      <ExperienceSection
                        content={content}
                        addExperience={addExperience}
                        updateExperience={updateExperience}
                        updateExperienceList={updateExperienceList}
                        removeExperience={removeExperience}
                        handleOptimize={handleOptimize}
                        optimizingId={optimizingId}
                      />
                    )}
                    {sectionId === "education" && (
                      <EducationSection
                        content={content}
                        addEducation={addEducation}
                        updateEducation={updateEducation}
                        updateEducationList={updateEducationList}
                        removeEducation={removeEducation}
                      />
                    )}
                    {sectionId === "projects" && (
                      <ProjectSection
                        content={content}
                        addProject={addProject}
                        updateProject={updateProject}
                        updateProjectList={updateProjectList}
                        removeProject={removeProject}
                      />
                    )}
                    {sectionId === "skills" && (
                      <SkillsSection
                        content={content}
                        addSkillCategory={addSkillCategory}
                        updateSkillCategory={updateSkillCategory}
                        removeSkillCategory={removeSkillCategory}
                        updateSkills={updateSkills}
                      />
                    )}
                    {sectionId === "certificates" && (
                      <ItemsListSection
                        title="Sertifikat"
                        icon={<CertificateIcon className="h-4 w-4" />}
                        sectionId="certificates"
                        items={content.certificates || []}
                        addItem={addPredefinedSectionItem}
                        updateItem={updatePredefinedSectionItem}
                        updateItemList={updatePredefinedSectionItems}
                        removeItem={removePredefinedSectionItem}
                        onRemoveSection={(id) => {
                          updateSectionOrder(
                            (content.sectionOrder || []).filter(
                              (s) => s !== id,
                            ),
                          );
                        }}
                        placeholderTitle="Nama Sertifikat"
                        placeholderSubtitle="Penerbit Sertifikat"
                      />
                    )}
                    {sectionId === "awards" && (
                      <ItemsListSection
                        title="Penghargaan"
                        icon={<TrophyIcon className="h-4 w-4" />}
                        sectionId="awards"
                        items={content.awards || []}
                        addItem={addPredefinedSectionItem}
                        updateItem={updatePredefinedSectionItem}
                        updateItemList={updatePredefinedSectionItems}
                        removeItem={removePredefinedSectionItem}
                        onRemoveSection={(id) => {
                          updateSectionOrder(
                            (content.sectionOrder || []).filter(
                              (s) => s !== id,
                            ),
                          );
                        }}
                        placeholderTitle="Nama Penghargaan"
                        placeholderSubtitle="Pemberi Penghargaan"
                      />
                    )}
                    {sectionId === "publications" && (
                      <ItemsListSection
                        title="Publikasi"
                        icon={<BookOpenIcon className="h-4 w-4" />}
                        sectionId="publications"
                        items={content.publications || []}
                        addItem={addPredefinedSectionItem}
                        updateItem={updatePredefinedSectionItem}
                        updateItemList={updatePredefinedSectionItems}
                        removeItem={removePredefinedSectionItem}
                        onRemoveSection={(id) => {
                          updateSectionOrder(
                            (content.sectionOrder || []).filter(
                              (s) => s !== id,
                            ),
                          );
                        }}
                        placeholderTitle="Judul Publikasi"
                        placeholderSubtitle="Penerbit / Jurnal"
                      />
                    )}
                    {sectionId === "custom" && (
                      <CustomSection
                        content={content}
                        addCustomSection={addCustomSection}
                        updateCustomSection={updateCustomSection}
                        updateCustomSectionList={updateCustomSectionList}
                        removeCustomSection={removeCustomSection}
                        addCustomSectionItem={addCustomSectionItem}
                        updateCustomSectionItem={updateCustomSectionItem}
                        updateCustomSectionItemList={
                          updateCustomSectionItemList
                        }
                        removeCustomSectionItem={removeCustomSectionItem}
                      />
                    )}
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContent>
        </Sortable>

        <VisualSettingsSection content={content} updateStyle={updateStyle} />

        <div className="pt-4 pb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50 flex w-full items-center justify-center border-dashed py-6 transition-all"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Tambah Seksi Resume
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 rounded-none">
              <DropdownMenuItem
                disabled={content.sectionOrder?.includes("certificates")}
                onClick={() => addSectionToOrder("certificates")}
                className="rounded-none py-2.5"
              >
                <CertificateIcon className="mr-2 h-4 w-4" />
                Sertifikat
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={content.sectionOrder?.includes("awards")}
                onClick={() => addSectionToOrder("awards")}
                className="rounded-none py-2.5"
              >
                <TrophyIcon className="mr-2 h-4 w-4" />
                Penghargaan
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={content.sectionOrder?.includes("publications")}
                onClick={() => addSectionToOrder("publications")}
                className="rounded-none py-2.5"
              >
                <BookOpenIcon className="mr-2 h-4 w-4" />
                Publikasi
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={addCustomSection}
                className="rounded-none py-2.5"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Seksi Kustom
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Accordion>
    </div>
  );
}
