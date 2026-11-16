import { z } from "zod";

/**
 * Schema for ATS resume analysis input.
 */
export const analyzeResumeSchema = z.object({
  resumeContent: z
    .string()
    .min(100, "Resume terlalu pendek. Minimal 100 karakter."),
});

export type AnalyzeResumeInput = z.infer<typeof analyzeResumeSchema>;

/**
 * Schema for resume vs job description analysis input.
 */
export const analyzeResumeJobMatchSchema = z.object({
  resumeContent: z.string().min(50, "Resume terlalu pendek"),
  jobDescription: z.string().min(50, "Deskripsi pekerjaan terlalu pendek"),
});

export type AnalyzeResumeJobMatchInput = z.infer<
  typeof analyzeResumeJobMatchSchema
>;

/**
 * Schema for the AI-generated ATS analysis output.
 */
export const resumeAnalysisResultSchema = z.object({
  atsScore: z.number().min(0).max(100),
  overallFeedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  keywordSuggestions: z.array(z.string()),
  sectionScores: z.object({
    contact: z.number().min(0).max(100),
    summary: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
  }),
});

/**
 * Schema for the AI-generated job match analysis output.
 */
export const resumeJobMatchResultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
  verdict: z.string(),
});
