export * from "./auth";
export * from "./resumes";
export * from "./job-applications";
export * from "./ai";
export * from "./billing";

import { aiUsageLogs } from "./ai";
import { users } from "./auth";
import { transactions } from "./billing";
import { jobApplications } from "./job-applications";
import { coverLetters , resumes } from "./resumes";

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
