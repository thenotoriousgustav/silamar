import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { extractPdfText } from "@/features/resume-builder";
import { ResumeContentSchema } from "@/features/resumes-list";

export const runtime = "nodejs";

const ExtractionSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    title: z
      .string()
      .describe(
        "Job title or professional headline, e.g. 'Senior Frontend Developer'",
      ),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string(),
    website: z.string(),
    summary: z.string(),
  }),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      isCurrentJob: z.boolean(),
      description: z.array(z.string()),
      location: z.string(),
      employmentType: z
        .string()
        .describe(
          "Employment type if mentioned: full-time, part-time, internship, contract, freelance. Empty string if not specified.",
        ),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      major: z.string(),
      startYear: z.string(),
      endYear: z.string(),
      isCurrentlyStudying: z.boolean(),
      gpa: z.string(),
      location: z
        .string()
        .describe(
          "City/location of the institution, or empty string if not mentioned.",
        ),
      description: z.array(z.string()),
    }),
  ),
  skills: z
    .array(
      z.object({
        category: z
          .string()
          .describe(
            "The EXACT skill category name as written in the CV. Examples: 'Programming Languages', 'Frameworks'.",
          ),
        items: z.array(z.string()),
      }),
    )
    .describe("Each skill category in the CV must be a SEPARATE entry."),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.array(z.string()),
      technologies: z.array(z.string()),
      link: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),
  certificates: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      date: z.string(),
      link: z.string(),
      description: z.array(z.string()),
    }),
  ),
  awards: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      date: z.string(),
      description: z.array(z.string()),
    }),
  ),
  publications: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      date: z.string(),
      link: z.string(),
      description: z.array(z.string()),
    }),
  ),
});

const errorResponse = (message: string, status = 400) =>
  Response.json({ error: message }, { status });

const addId = <T extends object>(obj: T) => ({ ...obj, id: uuidv4() });
const mapWithIds = (items: any[]) =>
  items.map((item) => ({
    ...addId(item),
    description: item.description?.map((text: string) => addId({ text })),
  }));

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) return errorResponse("No file uploaded");
    if (file.type !== "application/pdf")
      return errorResponse("File must be in PDF format");
    if (file.size > 5 * 1024 * 1024)
      return errorResponse("Maximum file size is 5MB");

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractPdfText(buffer).catch(() => null);

    if (!extractedText || extractedText.trim().length < 50) {
      return errorResponse(
        "PDF does not contain enough text or could not be read.",
        422,
      );
    }

    const { output: rawData } = await generateText({
      model: openai("gpt-4.1-nano"),
      output: Output.object({ schema: ExtractionSchema }),
      messages: [
        {
          role: "system",
          content: `You are a precise resume parser. Extract information EXACTLY as written.
CRITICAL RULES:
- Every skill category in the CV must be a SEPARATE object. Never merge categories.
- For personalInfo.title: extract the professional headline/job title if present (e.g. "Senior Frontend Developer", "Fresh Graduate"). If not explicitly stated, infer from the most recent position or leave empty string.
- For dates: use format "MMM yyyy" (e.g. "Jan 2023", "Dec 2021"). If only year is available, use just the year.
- For location: extract city/country if mentioned, otherwise empty string.
- For employmentType: extract if mentioned (full-time, part-time, internship, contract, freelance), otherwise empty string.
- If a field is not found in the CV, return an empty string "" (never null or undefined).
- Extract ALL sections including certificates, awards, publications if present.`,
        },
        {
          role: "user",
          content: `Extract ALL information from this resume text:
          """
          ${extractedText}
          """`,
        },
      ],
    });

    const resumeData = {
      personalInfo: {
        ...rawData.personalInfo,
        linkedin: { label: "", url: rawData.personalInfo.linkedin },
        website: { label: "", url: rawData.personalInfo.website },
      },
      experience: rawData.experience.map((exp) => ({
        ...addId(exp),
        description: exp.description?.map((text: string) => addId({ text })),
      })),
      education: rawData.education.map((edu) => ({
        ...addId(edu),
        description: edu.description?.map((text: string) => addId({ text })),
      })),
      skills: rawData.skills.map(addId),
      projects: rawData.projects.map((proj) => ({
        ...addId(proj),
        description: proj.description?.map((text: string) => addId({ text })),
      })),
      certificates: mapWithIds(rawData.certificates || []),
      awards: mapWithIds(rawData.awards || []),
      publications: mapWithIds(rawData.publications || []),
    };

    return Response.json(ResumeContentSchema.parse(resumeData));
  } catch (error) {
    console.error("Extraction error:", error);
    return Response.json(
      {
        error: "Failed to extract resume data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
