import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import { resumes } from "./resumes";

export const resumeAnalyses = pgTable("resume_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  resumeId: text("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  jobId: text("job_id"), // Optional: linked to a specific job in tracker
  overallScore: integer("overall_score").notNull(),
  grade: text("grade").notNull(),
  result: jsonb("result").notNull(), // Full JSON from AI
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
