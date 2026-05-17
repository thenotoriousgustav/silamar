import { z } from "zod";

/**
 * Input schema for job-fit analysis.
 * The user provides a resumeId (looked up server-side) and either a free-form
 * job description or a structured job reference.
 */
export const analyzeJobFitInputSchema = z.object({
  resumeId: z.string().min(1, "resumeId wajib diisi"),
  jobTitle: z.string().trim().max(200).optional(),
  company: z.string().trim().max(200).optional(),
  jobDescription: z
    .string()
    .trim()
    .min(50, "Deskripsi pekerjaan minimal 50 karakter"),
  /** Optional: link this analysis to a job from the job tracker. */
  jobId: z.string().optional(),
});

export type AnalyzeJobFitInput = z.infer<typeof analyzeJobFitInputSchema>;

/**
 * Decision verdict returned by the AI.
 */
export const jobFitDecisionEnum = z.enum([
  "strong_fit",
  "good_fit",
  "stretch",
  "poor_fit",
  "not_fit",
]);

export const jobFitImportanceEnum = z.enum(["must_have", "nice_to_have"]);

export const jobFitSeverityEnum = z.enum([
  "blocking",
  "high",
  "medium",
  "low",
]);

/**
 * Zod schema for the AI-generated job-fit analysis output.
 * Mirrors the shape required by the prompt in `job-fit-prompt.ts`.
 */
export const jobFitResultSchema = z.object({
  matchScore: z.number().int().min(0).max(100),

  verdict: z.object({
    decision: jobFitDecisionEnum,
    label: z.string(),
    confidence: z.enum(["high", "medium", "low"]),
    shouldApply: z.boolean(),
    summary: z.string(),
  }),

  domainAlignment: z.object({
    score: z.number().int().min(0).max(100),
    resumeDomain: z.string(),
    jobDomain: z.string(),
    isCompatible: z.boolean(),
    reasoning: z.string(),
  }),

  roleAlignment: z.object({
    score: z.number().int().min(0).max(100),
    seniorityMatch: z.enum([
      "match",
      "underqualified",
      "overqualified",
      "unclear",
    ]),
    yearsExperienceRequired: z.number().int().nullable(),
    yearsExperienceCandidate: z.number().int().nullable(),
    reasoning: z.string(),
  }),

  skillsAnalysis: z.object({
    score: z.number().int().min(0).max(100),
    matched: z.array(
      z.object({
        skill: z.string(),
        importance: jobFitImportanceEnum,
        evidence: z.string(),
      }),
    ),
    missing: z.array(
      z.object({
        skill: z.string(),
        importance: jobFitImportanceEnum,
        impact: z.string(),
      }),
    ),
    transferable: z.array(
      z.object({
        skill: z.string(),
        appliesTo: z.string(),
        applicability: z.enum(["high", "medium", "low"]),
      }),
    ),
  }),

  experienceAlignment: z.object({
    score: z.number().int().min(0).max(100),
    relevantHighlights: z.array(
      z.object({
        title: z.string(),
        company: z.string(),
        relevance: z.enum(["high", "medium", "low"]),
        reason: z.string(),
      }),
    ),
    reasoning: z.string(),
  }),

  keywordMatch: z.object({
    score: z.number().int().min(0).max(100),
    matched: z.array(
      z.object({
        keyword: z.string(),
        frequency: z.number().int().min(0),
      }),
    ),
    missingCritical: z.array(z.string()),
    missingNiceToHave: z.array(z.string()),
  }),

  redFlags: z.array(
    z.object({
      severity: jobFitSeverityEnum,
      title: z.string(),
      description: z.string(),
    }),
  ),

  recommendations: z.array(
    z.object({
      priority: z.number().int().min(1).max(5),
      action: z.string(),
      rationale: z.string(),
    }),
  ),

  applyStrategy: z.object({
    chanceOfInterview: z.enum([
      "very_high",
      "high",
      "moderate",
      "low",
      "very_low",
    ]),
    customizationNeeded: z.enum([
      "minimal",
      "moderate",
      "significant",
      "complete_rewrite",
    ]),
    resumeEdits: z.array(z.string()),
    coverLetterAngle: z.string(),
  }),
});

export type JobFitDTO = z.infer<typeof jobFitResultSchema>;
