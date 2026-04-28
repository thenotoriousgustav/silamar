import { z } from "zod";

export const resumeAnalyzeSchema = z.object({
  atsScore: z.number().min(0).max(100),
  overallFeedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  keywordSuggestions: z.array(z.string()),
  sectionScores: z.object({
    contact: z.number().min(0).max(100),
    summary: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
  }),
});

export type ResumeAnalyzeResult = z.infer<typeof resumeAnalyzeSchema>;

export function buildResumeAnalyzePrompt(resumeContent: string): string {
  return `
Kamu adalah AI expert dalam analisis resume/CV yang telah membantu ribuan fresh graduate Indonesia mendapatkan pekerjaan impian mereka.

Analisis resume berikut dan berikan evaluasi ATS (Applicant Tracking System) yang komprehensif dalam konteks pasar kerja Indonesia.

## Resume yang Dianalisis:
${resumeContent}

## Instruksi:
Berikan analisis detail dalam format JSON berikut (semua teks dalam Bahasa Indonesia):

{
  "atsScore": <angka 0-100 berdasarkan kualitas ATS keseluruhan>,
  "overallFeedback": "<feedback umum 2-3 kalimat tentang resume ini>",
  "strengths": [
    "<kekuatan 1>",
    "<kekuatan 2>",
    "<kekuatan 3>"
  ],
  "improvements": [
    "<saran perbaikan 1>",
    "<saran perbaikan 2>",
    "<saran perbaikan 3>"
  ],
  "keywordSuggestions": [
    "<keyword ATS yang disarankan 1>",
    "<keyword ATS yang disarankan 2>",
    "<keyword ATS yang disarankan 3>",
    "<keyword ATS yang disarankan 4>",
    "<keyword ATS yang disarankan 5>"
  ],
  "sectionScores": {
    "contact": <0-100>,
    "summary": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>
  }
}

Faktor penilaian ATS:
- Format yang bersih dan mudah dibaca mesin
- Penggunaan keyword yang relevan
- Kelengkapan informasi kontak
- Deskripsi pengalaman yang kuantitatif (angka, persentase)
- Urutan informasi yang logis
- Tidak ada gambar, tabel, atau elemen yang sulit dibaca ATS

Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}
