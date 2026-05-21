/**
 * Comprehensive resume analysis DTO.
 * Based on the full analysis schema defined in prompt.txt.
 */

export type OverallScore = {
  total: number;
  grade: string;
  label: string;
  summary: string;
};

export type ATSCheck = {
  category: string;
  status: "pass" | "warning" | "fail";
  message: string;
  suggestion: string;
};

export type ATSCompatibility = {
  score: number;
  passed: boolean;
  checks: ATSCheck[];
};

export type SectionScoreItem = {
  section: string;
  score: number;
  status: "excellent" | "good" | "needs_work" | "poor";
  feedback: string;
  missing: string[];
  suggestion: string;
};

export type ContentQuality = {
  score: number;
  bulletPoints: {
    score: number;
    total: number;
    withActionVerb: number;
    withMetric: number;
    tooShort: number;
    tooLong: number;
    feedback: string;
    examples: { before: string; after: string } | null;
  };
  actionVerbs: {
    score: number;
    found: string[];
    weak: string[];
    suggestions: string[];
  };
  length: {
    pageCount: number;
    wordCount: number;
    status: "too_short" | "good" | "too_long";
    feedback: string;
  };
  writingQuality: {
    score: number;
    typosFound: number;
    issues: Array<{ text: string; suggestion: string }>;
  };
};

export type KeywordItem = {
  keyword: string;
  count: number;
  relevance: string;
};

export type KeywordSuggestedItem = {
  keyword: string;
  priority: string;
  reason: string;
};

export type KeywordOverusedItem = {
  keyword: string;
  reason: string;
};

export type KeywordAnalysis = {
  score: number;
  found: KeywordItem[];
  suggested: KeywordSuggestedItem[];
  overused: KeywordOverusedItem[];
};

export type RedFlag = {
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestion: string;
  highlightText: string;
};

export type ActionItem = {
  priority: number;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  title: string;
  description: string;
  estimatedTime: string;
};

export type HighlightAnnotation = {
  text: string;
  type: "red_flag" | "weak_verb" | "typo" | "keyword_found" | "overused";
  tooltip: string;
};

export type ComprehensiveAnalysisDTO = {
  overallScore: OverallScore;
  atsCompatibility: ATSCompatibility;
  sectionScores: SectionScoreItem[];
  contentQuality: ContentQuality;
  keywordAnalysis: KeywordAnalysis;
  redFlags: RedFlag[];
  strengths: string[];
  actionItems: ActionItem[];
  competitiveInsight: {
    percentile: number;
    topMissingElements: string[];
  };
  highlights: HighlightAnnotation[];
};
