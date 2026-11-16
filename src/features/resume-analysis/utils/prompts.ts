/**
 * Builds the AI prompt for ATS resume analysis.
 * Instructs the AI to evaluate the resume against ATS criteria
 * and return structured scoring in Indonesian.
 */
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

/**
 * Builds the AI prompt for resume vs job description match analysis.
 * Instructs the AI to compare the resume against a job description
 * and return keyword matching results in Indonesian.
 */
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
