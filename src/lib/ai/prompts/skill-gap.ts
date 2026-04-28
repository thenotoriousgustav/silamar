import { z } from "zod";

export const skillGapSchema = z.object({
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.object({
    skill: z.string(),
    priority: z.enum(["high", "medium", "low"]),
    howToLearn: z.string(),
  })),
  overallGapScore: z.number().min(0).max(100),
  learningPath: z.array(z.string()),
  estimatedTimeToReady: z.string(),
  verdict: z.string(),
});

export type SkillGapResult = z.infer<typeof skillGapSchema>;

export function buildSkillGapPrompt(
  userSkills: string[],
  jobTitle: string,
  jobDescription: string
): string {
  return `
Kamu adalah career advisor expert yang membantu fresh graduate Indonesia mengidentifikasi kesenjangan skill untuk karier impian mereka.

Analisis skill gap antara skill yang dimiliki dengan requirement posisi yang diinginkan.

## Skill yang Dimiliki User:
${userSkills.join(", ")}

## Posisi Target:
${jobTitle}

## Deskripsi Pekerjaan / Requirement:
${jobDescription}

## Instruksi:
Berikan analisis skill gap yang actionable dalam format JSON berikut (dalam Bahasa Indonesia):

{
  "matchedSkills": [
    "<skill yang sudah dimiliki dan relevan dengan posisi>"
  ],
  "missingSkills": [
    {
      "skill": "<nama skill yang kurang>",
      "priority": "high|medium|low",
      "howToLearn": "<cara belajar skill ini: platform, kursus, atau resource spesifik>"
    }
  ],
  "overallGapScore": <0-100, semakin tinggi semakin siap>,
  "learningPath": [
    "<langkah 1 yang harus dilakukan>",
    "<langkah 2>",
    "<langkah 3>",
    "<langkah 4>",
    "<langkah 5>"
  ],
  "estimatedTimeToReady": "<estimasi waktu untuk siap melamar posisi ini, contoh: '3-6 bulan'>",
  "verdict": "<kesimpulan singkat dan motivasi 2-3 kalimat>"
}

Catatan:
- Priority "high" = skill yang sangat sering disebutkan di JD atau kritikal untuk pekerjaan
- Priority "medium" = skill yang membantu tapi tidak wajib
- Priority "low" = nice to have
- Berikan resource belajar yang spesifik (contoh: "Kursus Python di Dicoding", "Bootcamp React di Buildwithangga")
- Focus pada platform Indonesia jika ada

Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}
