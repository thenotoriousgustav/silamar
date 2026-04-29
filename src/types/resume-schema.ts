import { z } from "zod";

export const ResumePersonalInfoSchema = z.object({
  fullName: z.string().describe("Full name of the person"),
  email: z.string().describe("Email address"),
  phone: z.string().describe("Phone number"),
  location: z.string().describe("City and country of residence"),
  linkedin: z.string().describe("LinkedIn profile URL or empty string"),
  website: z
    .string()
    .describe("Portfolio or personal website URL or empty string"),
  summary: z.string().describe("A professional summary or about me section"),
});

export const ResumeExperienceSchema = z.object({
  id: z.string().describe("Unique identifier for the experience item (UUID)"),
  company: z.string().describe("Name of the company"),
  position: z.string().describe("Job title or position"),
  startDate: z.string().describe("Start date (e.g., 'Jan 2023' or '2022')"),
  endDate: z.string().describe("End date, 'Present', or empty string"),
  isCurrentJob: z.boolean().describe("Whether the person currently works here"),
  description: z
    .array(z.string())
    .describe("List of responsibilities and achievements as bullet points"),
  location: z
    .string()
    .describe("City and country of the company or empty string"),
});

export const ResumeEducationSchema = z.object({
  id: z.string().describe("Unique identifier for the education item (UUID)"),
  institution: z.string().describe("Name of the university or school"),
  degree: z.string().describe("Degree name (e.g., 'Bachelor of Science')"),
  major: z.string().describe("Field of study"),
  startYear: z.string().describe("Year started"),
  endYear: z
    .string()
    .describe("Year graduated, expected graduation, or empty string"),
  isCurrentlyStudying: z
    .boolean()
    .describe("Whether the person is currently studying here"),
  gpa: z
    .string()
    .describe("Grade Point Average (e.g., '3.8/4.0') or empty string"),
  description: z
    .array(z.string())
    .describe(
      "Relevant coursework, honors, or activities as bullet points (array of strings)",
    ),
});

export const ResumeProjectSchema = z.object({
  id: z.string().describe("Unique identifier for the project item (UUID)"),
  name: z.string().describe("Name of the project"),
  description: z.array(z.string()).describe("Detailed description of the project as bullet points"),
  technologies: z.array(z.string()).describe("List of technologies used"),
  link: z.string().describe("Project URL or GitHub link or empty string"),
  startDate: z.string().describe("Start date or empty string"),
  endDate: z.string().describe("End date or empty string"),
});

export const ResumeContentSchema = z.object({
  personalInfo: ResumePersonalInfoSchema,
  experience: z.array(ResumeExperienceSchema),
  education: z.array(ResumeEducationSchema),
  skills: z.array(z.string()).describe("List of professional skills"),
  projects: z.array(ResumeProjectSchema),
});
