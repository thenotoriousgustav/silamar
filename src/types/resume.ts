export interface ResumePersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  summaryEn?: string;
  summaryId?: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  description: string | string[];
  descriptionEn?: string | string[];
  descriptionId?: string | string[];
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
  description?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeStyle {
  fontFamily: string;
  fontSize: string;
  language?: "id" | "en";
}

export interface ResumeContent {
  personalInfo: ResumePersonalInfo;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
  style?: ResumeStyle;
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
