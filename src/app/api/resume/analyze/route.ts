import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { ResumeContentSchema } from "@/features/resumes-list/schema";
import { extractPdfText } from "@/features/resume-builder/utils/pdf-extractor";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Schema sederhana untuk ekstraksi AI agar lebih cepat (tanpa ID di level poin deskripsi)
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
  skills: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
    }),
  ),
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
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "File harus berformat PDF" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";
    try {
      extractedText = await extractPdfText(buffer);
    } catch (pdfError) {
      console.error("PDF parse error:", pdfError);
      return Response.json(
        {
          error:
            "Gagal membaca PDF. Pastikan file tidak terenkripsi atau rusak.",
        },
        { status: 422 },
      );
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return Response.json(
        {
          error:
            "PDF tidak berisi teks yang cukup. Mungkin PDF hasil scan — gunakan PDF dengan teks asli.",
        },
        { status: 422 },
      );
    }

    // Kirim ke AI menggunakan model gpt-4o-mini yang jauh lebih cepat
    // Menggunakan ExtractionSchema yang lebih ringan (hanya string array untuk deskripsi)
    const { output: rawData } = await generateText({
      model: openai("gpt-4.1-nano"),
      output: Output.object({
        schema: ExtractionSchema,
      }),
      messages: [
        {
          role: "user",
          content: `Extract resume information from the text below.
          
Rules:
1. Format dates as 'Month Year' or 'Year'. Use 'Present' for ongoing roles.
2. Split experience, education, and project descriptions into clean bullet points.
3. If information is missing, use empty strings or arrays.
4. Categorize skills logically (e.g., 'Technical Skills', 'Soft Skills').

Resume Text:
"""
${extractedText}
"""`,
        },
      ],
    });

    // Transform data: Tambahkan UUID di server untuk efisiensi token AI
    const resumeData = {
      personalInfo: {
        ...rawData.personalInfo,
        linkedin: { label: "", url: rawData.personalInfo.linkedin },
        website: { label: "", url: rawData.personalInfo.website },
      },
      experience: rawData.experience.map((exp) => ({
        ...exp,
        id: uuidv4(),
        description: exp.description.map((text) => ({
          id: uuidv4(),
          text,
        })),
      })),
      education: rawData.education.map((edu) => ({
        ...edu,
        id: uuidv4(),
        description: edu.description.map((text) => ({
          id: uuidv4(),
          text,
        })),
      })),
      skills: rawData.skills.map((skill) => ({
        ...skill,
        id: uuidv4(),
      })),
      projects: rawData.projects.map((proj) => ({
        ...proj,
        id: uuidv4(),
        description: proj.description.map((text) => ({
          id: uuidv4(),
          text,
        })),
      })),
    };

    // Validasi akhir dengan ResumeContentSchema asli untuk memastikan kompatibilitas
    const validatedData = ResumeContentSchema.parse(resumeData);

    return Response.json(validatedData);
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
