"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  ResumeContent,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
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
  const [content, setContent] = useState<ResumeContent>({
    ...DEFAULT_RESUME,
    ...initialContent,
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

  const updateSkills = useCallback((skills: string[]) => {
    setContent((prev: ResumeContent) => ({ ...prev, skills }));
    setIsDirty(true);
  }, []);

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
      if (!activeId || !isDirty) return;

      setIsSaving(true);
      try {
        const res = await fetch(`/api/resumes/${activeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: contentRef.current,
            title: title || "Untitled Resume",
          }),
          // Important for save-on-exit
          keepalive: true,
        });

        if (!res.ok) throw new Error("Failed to save");
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
    [resumeId, isDirty],
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
    updateStyle,
    save,
    setContent,
    setIsDirty,
    contentRef,
    isDirtyRef,
  };
}
