/**
 * DTO for ATS resume analysis result.
 * Maps from the AI-generated analysis output.
 */
export type ResumeAnalysisDTO = {
  atsScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  keywordSuggestions: string[];
  sectionScores: SectionScores;
};

export type SectionScores = {
  contact: number;
  summary: number;
  experience: number;
  education: number;
  skills: number;
};

/**
 * DTO for resume vs job description match analysis result.
 */
export type ResumeJobMatchDTO = {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  verdict: string;
};
