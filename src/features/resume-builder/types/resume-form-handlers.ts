import type {
  ResumeContent,
  ResumeCustomSection,
  ResumeCustomSectionItem,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
} from "@/types/resume";

/**
 * Groups all resume form mutation handlers into a single cohesive object.
 * This reduces the prop count of ResumeForm from 30+ individual handlers
 * to a single `handlers` prop containing all operations.
 */
export type ResumeFormHandlers = {
  updatePersonalInfo: (info: Partial<ResumeContent["personalInfo"]>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ResumeExperience>) => void;
  updateExperienceList: (experience: ResumeExperience[]) => void;
  removeExperience: (id: string) => void;
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
  updatePredefinedSectionItems: (
    type: "certificates" | "awards" | "publications",
    items: ResumeCustomSectionItem[],
  ) => void;
  addPredefinedSectionItem: (
    type: "certificates" | "awards" | "publications",
  ) => void;
  updatePredefinedSectionItem: (
    type: "certificates" | "awards" | "publications",
    itemId: string,
    data: Partial<ResumeCustomSectionItem>,
  ) => void;
  removePredefinedSectionItem: (
    type: "certificates" | "awards" | "publications",
    itemId: string,
  ) => void;
  addSectionToOrder: (sectionId: string) => void;
  updateStyle: (style: Partial<ResumeContent["style"]>) => void;
  updateSectionOrder: (order: string[]) => void;
};
