import { z } from "zod";

export const coverLetterSchema = z.object({
  coverLetter: z.string(),
  subject: z.string(),
  tips: z.array(z.string()),
});

export type CoverLetterResult = z.infer<typeof coverLetterSchema>;

export function buildCoverLetterPrompt(
  resumeContent: string,
  jobTitle: string,
  company: string,
  jobDescription?: string,
  tone: "formal" | "friendly" | "professional" = "professional"
): string {
  const toneGuide = {
    formal: "sangat formal, sopan, dan tradisional",
    friendly: "hangat, antusias, dan personal namun tetap profesional",
    professional:
      "profesional, percaya diri, dan terstruktur dengan baik",
  };

  return `
Kamu adalah expert penulis surat lamaran kerja yang telah membantu ribuan fresh graduate Indonesia mendapatkan panggilan interview.

Buat surat lamaran kerja yang menarik dan personal berdasarkan informasi berikut.

## Data Pelamar (dari Resume):
${resumeContent}

## Posisi yang Dilamar:
- Jabatan: ${jobTitle}
- Perusahaan: ${company}
${jobDescription ? `- Deskripsi Pekerjaan: ${jobDescription}` : ""}

## Instruksi:
Buat surat lamaran dengan tone ${toneGuide[tone]} dalam format JSON berikut:

{
  "coverLetter": "<surat lamaran lengkap dalam Bahasa Indonesia, 3-4 paragraf>",
  "subject": "<subjek email yang menarik untuk posisi ini>",
  "tips": [
    "<tips spesifik untuk meningkatkan peluang di perusahaan ini>",
    "<tips 2>",
    "<tips 3>"
  ]
}

Panduan penulisan surat lamaran:
- Paragraf 1: Perkenalan dan posisi yang dilamar
- Paragraf 2: Pengalaman dan skill relevan yang paling kuat
- Paragraf 3: Mengapa tertarik dengan perusahaan ini spesifik
- Paragraf 4: Penutup dan call to action

Pastikan surat lamaran:
- Personal dan tidak template biasa
- Menyebutkan nama perusahaan secara spesifik
- Menonjolkan pencapaian yang terukur
- Panjang 250-350 kata
- Tone yang sesuai dengan kultur perusahaan

Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}
