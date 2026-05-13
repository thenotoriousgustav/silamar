import { z } from "zod";

export const coverLetterSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  cityAndPostal: z.string(),
  recipientName: z.string(),
  companyName: z.string(),
  department: z.string(),
  recipientAddress: z.string(),
  recipientCityAndPostal: z.string(),
  subject: z.string(),
  content: z.string(),
  tips: z.array(z.string()),
});

export type CoverLetterResult = z.infer<typeof coverLetterSchema>;

type CoverLetterPromptParams = {
  resumeContent: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  tone?: "formal" | "friendly" | "professional";
};

export function buildCoverLetterPrompt(params: CoverLetterPromptParams): string {
  const {
    resumeContent,
    jobTitle,
    company,
    jobDescription,
    tone = "professional",
  } = params;
  const toneGuide = {
    formal: "sangat formal, sopan, dan tradisional",
    friendly: "hangat, antusias, dan personal namun tetap profesional",
    professional: "profesional, percaya diri, dan terstruktur dengan baik",
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
Buat surat lamaran dengan tone ${toneGuide[tone]} dalam format JSON berikut yang sesuai dengan struktur database builder kami:

{
  "fullName": "<nama lengkap dari resume>",
  "phone": "<nomor telepon dari resume>",
  "email": "<email dari resume>",
  "address": "<alamat dari resume>",
  "cityAndPostal": "<kota & kode pos dari resume>",
  "recipientName": "Bapak/Ibu HRD",
  "companyName": "${company}",
  "department": "Human Resources",
  "recipientAddress": "Alamat Perusahaan",
  "recipientCityAndPostal": "Kota, Kode Pos",
  "subject": "<subjek email yang menarik untuk posisi ini>",
  "content": "<isi surat lamaran lengkap dalam Bahasa Indonesia, 3-4 paragraf>",
  "tips": [
    "<tips spesifik 1>",
    "<tips spesifik 2>",
    "<tips spesifik 3>"
  ]
}

Panduan penulisan isi surat (content):
- Paragraf 1: Perkenalan dan posisi yang dilamar
- Paragraf 2: Pengalaman dan skill relevan yang paling kuat
- Paragraf 3: Mengapa tertarik dengan perusahaan ini spesifik
- Paragraf 4: Penutup dan call to action

Pastikan:
- Isi surat (content) menggunakan Bahasa Indonesia yang baik dan benar.
- Menyebutkan nama perusahaan secara spesifik.
- Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}
