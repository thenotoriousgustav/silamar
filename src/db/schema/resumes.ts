import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const resumeTemplates = pgTable("resume_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  thumbnail: text("thumbnail"),
  isPremium: boolean("is_premium").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Resume Saya"),
  slug: text("slug"),
  templateId: text("template_id").references(() => resumeTemplates.id),
  content: jsonb("content"),
  atsScore: integer("ats_score"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const coverLetters = pgTable("cover_letters", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  resumeId: text("resume_id").references(() => resumes.id, {
    onDelete: "set null",
  }),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
