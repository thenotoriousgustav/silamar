import { z } from "zod";

/**
 * Zod schema for the comprehensive resume analysis AI output.
 * Used to validate and type-check the structured output from GPT.
 */
export const comprehensiveAnalysisResultSchema = z.object({
  overallScore: z.object({
    total: z.number().min(0).max(100),
    grade: z.string(),
    label: z.string(),
    summary: z.string(),
  }),
  atsCompatibility: z.object({
    score: z.number().min(0).max(100),
    passed: z.boolean(),
    checks: z.array(
      z.object({
        category: z.string(),
        status: z.enum(["pass", "warning", "fail"]),
        message: z.string(),
        suggestion: z.string(),
      }),
    ),
  }),
  sectionScores: z.array(
    z.object({
      section: z.string(),
      score: z.number().min(0).max(100),
      status: z.enum(["excellent", "good", "needs_work", "poor"]),
      feedback: z.string(),
      missing: z.array(z.string()),
      suggestion: z.string(),
    }),
  ),
  contentQuality: z.object({
    score: z.number().min(0).max(100),
    bulletPoints: z.object({
      score: z.number().min(0).max(100),
      total: z.number(),
      withActionVerb: z.number(),
      withMetric: z.number(),
      tooShort: z.number(),
      tooLong: z.number(),
      feedback: z.string(),
      examples: z
        .object({
          before: z.string(),
          after: z.string(),
        })
        .nullable(),
    }),
    actionVerbs: z.object({
      score: z.number().min(0).max(100),
      found: z.array(z.string()),
      weak: z.array(z.string()),
      suggestions: z.array(z.string()),
    }),
    length: z.object({
      pageCount: z.number(),
      wordCount: z.number(),
      status: z.enum(["too_short", "good", "too_long"]),
      feedback: z.string(),
    }),
    writingQuality: z.object({
      score: z.number().min(0).max(100),
      typosFound: z.number(),
      issues: z.array(
        z.object({
          text: z.string(),
          suggestion: z.string(),
        }),
      ),
    }),
  }),
  keywordAnalysis: z.object({
    score: z.number().min(0).max(100),
    found: z.array(
      z.object({
        keyword: z.string(),
        count: z.number(),
        relevance: z.string(),
      }),
    ),
    suggested: z.array(
      z.object({
        keyword: z.string(),
        priority: z.string(),
        reason: z.string(),
      }),
    ),
    overused: z.array(
      z.object({
        keyword: z.string(),
        reason: z.string(),
      }),
    ),
  }),
  redFlags: z.array(
    z.object({
      severity: z.enum(["high", "medium", "low"]),
      title: z.string(),
      description: z.string(),
      suggestion: z.string(),
      highlightText: z.string(),
    }),
  ),
  strengths: z.array(z.string()),
  actionItems: z.array(
    z.object({
      priority: z.number(),
      impact: z.enum(["high", "medium", "low"]),
      effort: z.enum(["low", "medium", "high"]),
      title: z.string(),
      description: z.string(),
      estimatedTime: z.string(),
    }),
  ),
  competitiveInsight: z.object({
    percentile: z.number().min(0).max(100),
    topMissingElements: z.array(z.string()),
  }),
  highlights: z.array(
    z.object({
      text: z.string(),
      type: z.enum([
        "red_flag",
        "weak_verb",
        "typo",
        "keyword_found",
        "overused",
      ]),
      tooltip: z.string(),
    }),
  ),
});
