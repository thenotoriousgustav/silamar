import { z } from "zod";

export const resumeAnalyzeJdSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
  verdict: z.string(),
});

export type ResumeAnalyzeJdResult = z.infer<typeof resumeAnalyzeJdSchema>;

export function buildResumeAnalyzeJdPrompt(
  resumeContent: string,
  jobDescription: string,
): string {
  return `
Kamu adalah AI expert dalam mencocokkan resume dengan deskripsi pekerjaan untuk membantu fresh graduate Indonesia mendapatkan pekerjaan.

Analisis kecocokan antara resume dan deskripsi pekerjaan berikut.

## Resume:
${resumeContent}

## Deskripsi Pekerjaan:
${jobDescription}

## Instruksi:
Analisis kecocokan dan berikan hasil dalam format JSON berikut (semua teks dalam Bahasa Indonesia):

{
  "matchScore": <angka 0-100 yang menunjukkan persentase kecocokan>,
  "matchedKeywords": [
    "<keyword yang ada di resume dan juga di JD>",
    "<keyword yang matched>"
  ],
  "missingKeywords": [
    "<keyword penting di JD yang TIDAK ada di resume>",
    "<missing keyword>"
  ],
  "suggestions": [
    "<saran spesifik untuk meningkatkan kecocokan>",
    "<saran 2>",
    "<saran 3>"
  ],
  "verdict": "<kesimpulan 2-3 kalimat apakah resume cocok dan apa yang harus dilakukan>"
}

Panduan penilaian match score:
- 80-100: Sangat cocok, sangat direkomendasikan untuk melamar
- 60-79: Cukup cocok, perlu beberapa penyesuaian
- 40-59: Kurang cocok, perlu banyak perbaikan
- 0-39: Tidak cocok, pertimbangkan posisi lain

Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}
