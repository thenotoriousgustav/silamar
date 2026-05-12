// app/api/resume/import/route.ts

import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { ResumeContentSchema } from "@/features/resumes-list/schema";
import { extractPdfText } from "@/features/resume-builder/utils/pdf-extractor";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ExtractionSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
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
      return errorResponse("File harus berformat PDF");
    if (file.size > 5 * 1024 * 1024)
      return errorResponse("Ukuran file maksimal 5MB");

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractPdfText(buffer).catch(() => null);

    if (!extractedText || extractedText.trim().length < 50) {
      return errorResponse(
        "PDF tidak berisi teks yang cukup atau gagal dibaca.",
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
          CRITICAL: Every skill category in the CV must be a SEPARATE object. Never merge categories.`,
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
      experience: mapWithIds(rawData.experience),
      education: mapWithIds(rawData.education),
      skills: rawData.skills.map(addId),
      projects: mapWithIds(rawData.projects),
      certificates: mapWithIds(rawData.certificates || []),
      awards: mapWithIds(rawData.awards || []),
      publications: mapWithIds(rawData.publications || []),
    };

    return Response.json(ResumeContentSchema.parse(resumeData));
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      {
        error: "Gagal menganalisis resume",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
