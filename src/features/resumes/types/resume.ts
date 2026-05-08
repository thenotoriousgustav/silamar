export interface ResumePersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: {
    label: string;
    url: string;
  };
  website?: {
    label: string;
    url: string;
  };
  photoUrl?: string;
  summary?: string;
}

export interface DescriptionItem {
  id: string;
  text: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  description: DescriptionItem[];
  location?: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  major: string;
  startYear: string;
  endYear?: string;
  isCurrentlyStudying: boolean;
  gpa?: string;
  description: DescriptionItem[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: DescriptionItem[];
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeSkill {
  id: string;
  category: string;
  items: string[];
}

export interface ResumeCustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: DescriptionItem[];
  link?: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  items: ResumeCustomSectionItem[];
}

export interface ResumeStyle {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  language?: "id" | "en";
  templateId?: ResumeTemplateId;
}

export interface ResumeContent {
  personalInfo: ResumePersonalInfo;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  customSections?: ResumeCustomSection[];
  style?: ResumeStyle;
  sectionOrder?: string[];
}

export interface AtsAnalysisResult {
  atsScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  keywordSuggestions: string[];
  sectionScores: {
    contact: number;
    summary: number;
    experience: number;
    education: number;
    skills: number;
  };
}

export interface JdMatchResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  verdict: string;
}

export const RESUME_TEMPLATE_IDS = [
  "classic",
  "modern",
  "minimal",
  "creative",
] as const;
export type ResumeTemplateId = (typeof RESUME_TEMPLATE_IDS)[number];
