import { z } from "zod";

export const ResumePersonalInfoSchema = z.object({
  fullName: z.string().describe("Full name of the person"),
  email: z.string().describe("Email address"),
  phone: z.string().describe("Phone number"),
  location: z.string().describe("City and country of residence"),
  linkedin: z
    .object({
      label: z
        .string()
        .describe("LinkedIn label (e.g., 'linkedin.com/in/johndoe')"),
      url: z.string().describe("LinkedIn profile URL"),
    })
    .optional()
    .describe("LinkedIn profile information"),
  website: z
    .object({
      label: z.string().describe("Website label (e.g., 'portfolio.com')"),
      url: z.string().describe("Website URL"),
    })
    .optional()
    .describe("Portfolio or personal website information"),
  photoUrl: z
    .string()
    .optional()
    .describe("Profile photo URL or base64 string"),
  summary: z.string().describe("A professional summary or about me section"),
});

export const DescriptionItemSchema = z.object({
  id: z.string().describe("Unique identifier for the description item (UUID)"),
  text: z.string().describe("The description text"),
});

export const ResumeExperienceSchema = z.object({
  id: z.string().describe("Unique identifier for the experience item (UUID)"),
  company: z.string().describe("Name of the company"),
  position: z.string().describe("Job title or position"),
  startDate: z.string().describe("Start date (e.g., 'Jan 2023' or '2022')"),
  endDate: z.string().describe("End date, 'Present', or empty string"),
  isCurrentJob: z.boolean().describe("Whether the person currently works here"),
  description: z
    .array(DescriptionItemSchema)
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
    .array(DescriptionItemSchema)
    .describe("Relevant coursework, honors, or activities as bullet points"),
});

export const ResumeProjectSchema = z.object({
  id: z.string().describe("Unique identifier for the project item (UUID)"),
  name: z.string().describe("Name of the project"),
  description: z
    .array(DescriptionItemSchema)
    .describe("Detailed description of the project as bullet points"),
  technologies: z.array(z.string()).describe("List of technologies used"),
  link: z.string().describe("Project URL or GitHub link or empty string"),
  startDate: z.string().describe("Start date or empty string"),
  endDate: z.string().describe("End date or empty string"),
});

export const ResumeSkillSchema = z.object({
  id: z.string().describe("Unique identifier for the skill category (UUID)"),
  category: z
    .string()
    .describe(
      "Name of the skill category (e.g., 'Programming Languages', 'Soft Skills')",
    ),
  items: z.array(z.string()).describe("List of skills in this category"),
});

export const ResumeStyleSchema = z.object({
  fontFamily: z.string().default("Helvetica"),
  fontSize: z.string().default("text-sm"),
  lineHeight: z.string().default("relaxed"),
  language: z.enum(["id", "en"]).default("id"),
  templateId: z.string().default("classic"),
});

export const ResumeCustomSectionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  description: z.union([z.string(), z.array(DescriptionItemSchema)]).optional(),
  link: z.string().optional(),
});

export const ResumeContentSchema = z.object({
  personalInfo: ResumePersonalInfoSchema,
  experience: z.array(ResumeExperienceSchema),
  education: z.array(ResumeEducationSchema),
  skills: z
    .array(ResumeSkillSchema)
    .describe("Categorized list of professional skills"),
  projects: z.array(ResumeProjectSchema),
  certificates: z.array(ResumeCustomSectionItemSchema).optional(),
  awards: z.array(ResumeCustomSectionItemSchema).optional(),
  publications: z.array(ResumeCustomSectionItemSchema).optional(),
  customSections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        items: z.array(ResumeCustomSectionItemSchema),
      }),
    )
    .optional(),
  style: ResumeStyleSchema.optional(),
  sectionOrder: z.array(z.string()).optional(),
});
