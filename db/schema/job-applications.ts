import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./auth";
import { resumes } from "./resumes";

export const jobTypeEnum = pgEnum("job_type", [
  "full-time",
  "part-time",
  "internship",
  "contract",
  "freelance",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "dilamar",
  "interview",
  "penawaran",
  "ditolak",
]);

export const jobTrackers = pgTable("job_trackers", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackerId: text("tracker_id").references(() => jobTrackers.id, {
    onDelete: "cascade",
  }),
  resumeId: text("resume_id").references(() => resumes.id, {
    onDelete: "set null",
  }),
  company: text("company").notNull(),
  position: text("position").notNull(),
  location: text("location"),
  logoUrl: text("logo_url"),
  salary: text("salary"),
  type: jobTypeEnum("type").notNull().default("full-time"),
  status: jobStatusEnum("status").notNull().default("dilamar"),
  appliedDate: timestamp("applied_date"),
  interviewDate: timestamp("interview_date"),
  offerDate: timestamp("offer_date"),
  notes: text("notes"),
  jobUrl: text("job_url"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
