"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Accordion } from "@/components/ui/accordion";
import { GripVertical } from "lucide-react";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import type {
  ResumeContent,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkill,
  ResumeCustomSection,
  ResumeCustomSectionItem,
} from "@/features/resumes/types/resume";

// Import Modular Sections
import { ATSDashboard } from "./form-sections/ats-dashboard";
import { PersonalInfoSection } from "./form-sections/personal-info-section";
import { ExperienceSection } from "./form-sections/experience-section";
import { EducationSection } from "./form-sections/education-section";
import { ProjectSection } from "./form-sections/project-section";
import { SkillsSection } from "./form-sections/skills-section";
import { CustomSection } from "./form-sections/custom-section";
import { VisualSettingsSection } from "./form-sections/visual-settings-section";

interface ResumeFormProps {
  content: ResumeContent;
  updatePersonalInfo: (info: Partial<ResumeContent["personalInfo"]>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ResumeExperience>) => void;
  removeExperience: (id: string) => void;
  updateExperienceList: (experience: ResumeExperience[]) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<ResumeEducation>) => void;
  updateEducationList: (education: ResumeEducation[]) => void;
  removeEducation: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<ResumeProject>) => void;
  updateProjectList: (projects: ResumeProject[]) => void;
  removeProject: (id: string) => void;
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<ResumeSkill>) => void;
  removeSkillCategory: (id: string) => void;
  updateSkills: (skills: ResumeSkill[]) => void;
  addCustomSection: () => void;
  updateCustomSection: (id: string, data: Partial<ResumeCustomSection>) => void;
  updateCustomSectionList: (sections: ResumeCustomSection[]) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (
    sectionId: string,
    itemId: string,
    data: Partial<ResumeCustomSectionItem>,
  ) => void;
  updateCustomSectionItemList: (
    sectionId: string,
    items: ResumeCustomSectionItem[],
  ) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  updateStyle: (style: Partial<ResumeContent["style"]>) => void;
  updateSectionOrder: (order: string[]) => void;
  jumpTarget?: string | null;
  onJumpEnd?: () => void;
}

export function ResumeForm({
  content,
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
  updateStyle,
  updateSectionOrder,
  jumpTarget,
  onJumpEnd,
}: ResumeFormProps) {
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
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Optional: highlight effect
          element.classList.add("ring-2", "ring-primary", "ring-offset-2");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-primary", "ring-offset-2");
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
        const currentBullets = [...(currentExp.description || [])];
        currentBullets[data.idx] = {
          ...currentBullets[data.idx],
          text: data.result,
        };
        updateExperience(data.expId, { description: currentBullets });
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
      </Accordion>
    </div>
  );
}
