import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import { jobApplications } from "./job-applications";
import { resumes } from "./resumes";

/**
 * Verdict decision returned by the job-fit analyzer.
 * Mirrors `jobFitDecisionEnum` in the application schema.
 */
export const jobFitDecisionEnum = pgEnum("job_fit_decision", [
  "strong_fit",
  "good_fit",
  "stretch",
  "poor_fit",
  "not_fit",
]);

/**
 * Stores each run of the resume-vs-job fit analyzer so the user can revisit
 * past results without re-spending credits.
 *
 * `jobId` is optional — populated when the analysis was launched against a
 * specific tracked job, so we can later show "latest fit for this job" inside
 * the Job Tracker UI.
 */
export const jobFitAnalyses = pgTable(
  "job_fit_analyses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    resumeId: text("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    jobId: text("job_id").references(() => jobApplications.id, {
      onDelete: "set null",
    }),
    // Snapshot of the job context at time of analysis (kept even if the
    // tracked job is later deleted/edited).
    jobTitle: text("job_title"),
    company: text("company"),
    jobDescription: text("job_description").notNull(),
    // Headline metrics — denormalized for cheap list queries.
    matchScore: integer("match_score").notNull(),
    decision: jobFitDecisionEnum("decision").notNull(),
    shouldApply: boolean("should_apply").notNull(),
    // Full JobFitDTO from the AI for the detail view.
    result: jsonb("result").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("job_fit_analyses_user_id_idx").on(table.userId),
    resumeIdIdx: index("job_fit_analyses_resume_id_idx").on(table.resumeId),
    jobIdIdx: index("job_fit_analyses_job_id_idx").on(table.jobId),
    createdAtIdx: index("job_fit_analyses_created_at_idx").on(table.createdAt),
  }),
);
