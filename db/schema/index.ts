export * from "./auth";
export * from "./resumes";
export * from "./job-applications";
export * from "./ai";
export * from "./billing";
export * from "./resume-analysis";
export * from "./job-fit-analysis";

import { aiUsageLogs } from "./ai";
import { users } from "./auth";
import { transactions } from "./billing";
import { jobApplications } from "./job-applications";
import { jobFitAnalyses } from "./job-fit-analysis";
import { coverLetters , resumes } from "./resumes";
import { resumeAnalyses } from "./resume-analysis";

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
export type CoverLetter = typeof coverLetters.$inferSelect;
export type NewCoverLetter = typeof coverLetters.$inferInsert;
export type AiUsageLog = typeof aiUsageLogs.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type NewResumeAnalysis = typeof resumeAnalyses.$inferInsert;
export type JobFitAnalysis = typeof jobFitAnalyses.$inferSelect;
export type NewJobFitAnalysis = typeof jobFitAnalyses.$inferInsert;
