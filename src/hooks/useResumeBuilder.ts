"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateResumeAction } from "@/app/(dashboard)/resume-builder/server";
import type {
  ResumeContent,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkill,
  ResumeCustomSection,
  ResumeCustomSectionItem,
} from "@/types/resume";

const DEFAULT_RESUME: ResumeContent = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  customSections: [],
  style: {
    fontFamily: "font-serif",
    fontSize: "text-sm",
  },
};

export function useResumeBuilder(
  resumeId?: string,
  initialContent?: Partial<ResumeContent>,
) {
  const router = useRouter();
  // Migration: Handle old skills format (string[]) and convert to ResumeSkill[]
  const migratedSkills =
    Array.isArray(initialContent?.skills) &&
    initialContent.skills.length > 0 &&
    typeof initialContent.skills[0] === "string"
      ? [
          {
            id: "legacy-skills",
            category: "Skills",
            items: initialContent.skills as unknown as string[],
          },
        ]
      : (initialContent?.skills as ResumeSkill[]) || [];

  const [content, setContent] = useState<ResumeContent>({
    ...DEFAULT_RESUME,
    ...initialContent,
    skills: migratedSkills,
    customSections: initialContent?.customSections || [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Ref to keep track of latest state for background saving
  const contentRef = useRef(content);
  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Sync to localStorage
  useEffect(() => {
    if (resumeId && isDirty && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        localStorage.setItem(
          `resume-draft-${resumeId}`,
          JSON.stringify({
            content,
            updatedAt: new Date().toISOString(),
          }),
        );
      }, 500); // Small debounce for localStorage
      return () => clearTimeout(timer);
    }
  }, [content, isDirty, resumeId]);

  const updatePersonalInfo = useCallback(
    (info: Partial<ResumeContent["personalInfo"]>) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info },
      }));
      setIsDirty(true);
    },
    [],
  );

  const addExperience = useCallback(() => {
    const newExp: ResumeExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      description: [],
      location: "",
    };
    setContent((prev: ResumeContent) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
    setIsDirty(true);
  }, []);

  const updateExperience = useCallback(
    (id: string, data: Partial<ResumeExperience>) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        experience: prev.experience.map((e: ResumeExperience) =>
          e.id === id ? { ...e, ...data } : e,
        ),
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeExperience = useCallback((id: string) => {
    setContent((prev: ResumeContent) => ({
      ...prev,
      experience: prev.experience.filter((e: ResumeExperience) => e.id !== id),
    }));
    setIsDirty(true);
  }, []);

  const addEducation = useCallback(() => {
    const newEdu: ResumeEducation = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      major: "",
      startYear: "",
      endYear: "",
      isCurrentlyStudying: false,
      gpa: "",
      description: [],
    };
    setContent((prev: ResumeContent) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
    setIsDirty(true);
  }, []);

  const updateEducation = useCallback(
    (id: string, data: Partial<ResumeEducation>) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        education: prev.education.map((e: ResumeEducation) =>
          e.id === id ? { ...e, ...data } : e,
        ),
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeEducation = useCallback((id: string) => {
    setContent((prev: ResumeContent) => ({
      ...prev,
      education: prev.education.filter((e: ResumeEducation) => e.id !== id),
    }));
    setIsDirty(true);
  }, []);

  const addProject = useCallback(() => {
    const newProject: ResumeProject = {
      id: crypto.randomUUID(),
      name: "",
      description: [],
      link: "",
      technologies: [],
    };
    setContent((prev: ResumeContent) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
    setIsDirty(true);
  }, []);

  const updateProject = useCallback(
    (id: string, data: Partial<ResumeProject>) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        projects: prev.projects.map((p: ResumeProject) =>
          p.id === id ? { ...p, ...data } : p,
        ),
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeProject = useCallback((id: string) => {
    setContent((prev: ResumeContent) => ({
      ...prev,
      projects: prev.projects.filter((p: ResumeProject) => p.id !== id),
    }));
    setIsDirty(true);
  }, []);

  // --- NEW: Categorized Skills ---
  const updateSkills = useCallback((skills: ResumeSkill[]) => {
    setContent((prev: ResumeContent) => ({ ...prev, skills }));
    setIsDirty(true);
  }, []);

  const addSkillCategory = useCallback(() => {
    const newSkill: ResumeSkill = {
      id: crypto.randomUUID(),
      category: "",
      items: [],
    };
    setContent((prev: ResumeContent) => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill],
    }));
    setIsDirty(true);
  }, []);

  const updateSkillCategory = useCallback(
    (id: string, data: Partial<ResumeSkill>) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        skills: prev.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeSkillCategory = useCallback((id: string) => {
    setContent((prev: ResumeContent) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
    setIsDirty(true);
  }, []);

  // --- NEW: Custom Sections ---
  const addCustomSection = useCallback(() => {
    const newSection: ResumeCustomSection = {
      id: crypto.randomUUID(),
      title: "Seksi Baru",
      items: [],
    };
    setContent((prev: ResumeContent) => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSection],
    }));
    setIsDirty(true);
  }, []);

  const updateCustomSection = useCallback(
    (id: string, data: Partial<ResumeCustomSection>) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        customSections: (prev.customSections || []).map((s) =>
          s.id === id ? { ...s, ...data } : s,
        ),
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeCustomSection = useCallback((id: string) => {
    setContent((prev: ResumeContent) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((s) => s.id !== id),
    }));
    setIsDirty(true);
  }, []);

  const addCustomSectionItem = useCallback((sectionId: string) => {
    const newItem: ResumeCustomSectionItem = {
      id: crypto.randomUUID(),
      title: "",
      description: [],
    };
    setContent((prev: ResumeContent) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s,
      ),
    }));
    setIsDirty(true);
  }, []);

  const updateCustomSectionItem = useCallback(
    (
      sectionId: string,
      itemId: string,
      data: Partial<ResumeCustomSectionItem>,
    ) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        customSections: (prev.customSections || []).map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((i) =>
                  i.id === itemId ? { ...i, ...data } : i,
                ),
              }
            : s,
        ),
      }));
      setIsDirty(true);
    },
    [],
  );

  const removeCustomSectionItem = useCallback(
    (sectionId: string, itemId: string) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        customSections: (prev.customSections || []).map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
            : s,
        ),
      }));
      setIsDirty(true);
    },
    [],
  );

  const updateStyle = useCallback(
    (styleUpdate: Partial<ResumeContent["style"]>) => {
      setContent((prev: ResumeContent) => ({
        ...prev,
        style: { ...prev.style, ...styleUpdate } as any,
      }));
      setIsDirty(true);
    },
    [],
  );

  const save = useCallback(
    async (idToSave?: string, title?: string) => {
      const activeId = idToSave || resumeId;
      if (!activeId || !isDirtyRef.current) return;

      setIsSaving(true);
      try {
        await updateResumeAction(activeId, {
          content: contentRef.current,
          title: title || "Untitled Resume",
        });

        setIsDirty(false);
        toast.success("Resume berhasil disimpan");
        // Clear local draft on successful DB save
        if (typeof window !== "undefined") {
          localStorage.removeItem(`resume-draft-${activeId}`);
        }
        return true;
      } catch (error) {
        console.error("Save error:", error);
        toast.error("Gagal menyimpan resume");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId],
  );

  return {
    content,
    isSaving,
    isDirty,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    updateSkills,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    updateStyle,
    save,
    setContent,
    setIsDirty,
    contentRef,
    isDirtyRef,
  };
}
