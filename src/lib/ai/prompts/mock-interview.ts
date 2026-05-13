import { z } from "zod";

export const mockInterviewResultSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      category: z.enum(["behavioral", "technical", "situational", "hr"]),
      question: z.string(),
      tips: z.string(),
      sampleAnswer: z.string(),
    }),
  ),
  interviewTips: z.array(z.string()),
  commonMistakes: z.array(z.string()),
});

export type MockInterviewResult = z.infer<typeof mockInterviewResultSchema>;

export const mockInterviewFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  improvedAnswer: z.string(),
  overallFeedback: z.string(),
});

export type MockInterviewFeedbackResult = z.infer<
  typeof mockInterviewFeedbackSchema
>;

type MockInterviewQuestionsParams = {
  jobTitle: string;
  company: string;
  resumeContent: string;
  jobDescription?: string;
};

export function buildMockInterviewQuestionsPrompt(
  params: MockInterviewQuestionsParams,
): string {
  const { jobTitle, company, resumeContent, jobDescription } = params;
  return `
Kamu adalah interviewer berpengalaman dari perusahaan top Indonesia yang membantu fresh graduate mempersiapkan diri untuk wawancara kerja.

Buat 8-10 pertanyaan interview yang relevan dan realistis.

## Posisi yang Dilamar:
- Jabatan: ${jobTitle}
- Perusahaan: ${company}
${jobDescription ? `- Deskripsi Pekerjaan: ${jobDescription}` : ""}

## Resume Pelamar:
${resumeContent}

## Instruksi:
Buat pertanyaan interview dalam format JSON berikut (dalam Bahasa Indonesia):

{
  "questions": [
    {
      "id": "q1",
      "category": "behavioral|technical|situational|hr",
      "question": "<pertanyaan interview yang spesifik dan relevan>",
      "tips": "<tips singkat cara menjawab pertanyaan ini>",
      "sampleAnswer": "<contoh jawaban yang baik dalam 2-3 kalimat>"
    }
  ],
  "interviewTips": [
    "<tips umum untuk interview di perusahaan/industri ini>",
    "<tips 2>",
    "<tips 3>"
  ],
  "commonMistakes": [
    "<kesalahan umum yang harus dihindari>",
    "<kesalahan 2>",
    "<kesalahan 3>"
  ]
}

Distribusi pertanyaan:
- 2-3 pertanyaan behavioral (pengalaman masa lalu)
- 2-3 pertanyaan technical (skill teknis relevan)
- 2 pertanyaan situational (bagaimana kamu akan menghadapi situasi X)
- 1-2 pertanyaan HR (motivasi, gaji, karier)

Buat pertanyaan yang spesifik berdasarkan resume dan posisi, bukan pertanyaan generik.

Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}

export function buildMockInterviewFeedbackPrompt(
  question: string,
  userAnswer: string,
  jobTitle: string,
): string {
  return `
Kamu adalah interviewer berpengalaman yang memberikan feedback konstruktif kepada fresh graduate Indonesia.

## Pertanyaan Interview:
${question}

## Posisi yang Dilamar:
${jobTitle}

## Jawaban yang Diberikan:
${userAnswer}

## Instruksi:
Berikan feedback yang konstruktif dan actionable dalam format JSON berikut (dalam Bahasa Indonesia):

{
  "score": <0-100 skor kualitas jawaban>,
  "strengths": [
    "<hal yang sudah bagus dari jawaban ini>"
  ],
  "improvements": [
    "<hal yang bisa diperbaiki>"
  ],
  "improvedAnswer": "<contoh jawaban yang lebih baik dan lengkap>",
  "overallFeedback": "<feedback keseluruhan yang motivatif dalam 2 kalimat>"
}

Panduan penilaian:
- 90-100: Jawaban sempurna, spesifik, dan meyakinkan
- 70-89: Jawaban baik, ada beberapa area yang bisa diperkuat
- 50-69: Cukup, tapi perlu lebih spesifik dan terstruktur
- 0-49: Perlu banyak perbaikan

Gunakan metode STAR (Situation, Task, Action, Result) sebagai acuan.

Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}
