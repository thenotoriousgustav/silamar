export * from "./auth";
export * from "./resumes";
export * from "./jobs";
export * from "./ai";
export * from "./billing";

import { users } from "./auth";
import { resumes } from "./resumes";
import { jobApplications } from "./jobs";
import { coverLetters } from "./resumes";
import { aiUsageLogs } from "./ai";
import { transactions } from "./billing";

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
