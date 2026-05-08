import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const aiFeatureEnum = pgEnum("ai_feature", [
  "resume_analyze",
  "resume_analyze_jd",
  "cover_letter",
  "skill_gap",
  "mock_interview",
]);

export const aiUsageLogs = pgTable("ai_usage_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  featureType: aiFeatureEnum("feature_type").notNull(),
  creditsUsed: integer("credits_used").notNull().default(1),
  inputData: jsonb("input_data"),
  outputData: jsonb("output_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
