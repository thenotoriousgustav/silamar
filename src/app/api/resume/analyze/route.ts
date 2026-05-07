import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { ResumeContentSchema } from "@/features/resumes/types/resume-schema";
import { extractPdfText } from "@/features/resumes/utils/pdf-extractor";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validasi tipe file
    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "File harus berformat PDF" },
        { status: 400 },
      );
    }

    // Validasi ukuran (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 },
      );
    }

    // Convert ke Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract teks menggunakan wrapper
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

    // Kirim ke AI untuk strukturisasi menggunakan standar API terbaru
    const { output: resumeData } = await generateText({
      model: openai("gpt-4o"),
      output: Output.object({
        schema: ResumeContentSchema,
      }),
      messages: [
        {
          role: "user",
          content: `You are an expert resume parser. Extract all information from the following resume text and structure it according to the provided schema.
          
Resume Text:
"""
${extractedText}
"""

Rules:
1. Format dates as 'Month Year' (e.g., 'Jan 2023') or just 'Year' if month is missing.
2. If still currently working/studying, use 'Present' for end date.
3. Generate valid UUIDs for all 'id' fields.
4. If information is missing, use empty string or empty array.
5. Skills should be a flat array of strings.
6. Keep summary concise but complete.
7. CRITICAL: Experience descriptions and achievements MUST be split into a clean array of strings (bullet points). Look for bullet characters (•, -, *), newlines, or logical sentence breaks to separate each achievement. Do NOT merge them into a single block of text.
8. Experience and Education descriptions MUST be returned as a clean array of strings (bullet points).`,
        },
      ],
    });

    return Response.json(resumeData);
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
