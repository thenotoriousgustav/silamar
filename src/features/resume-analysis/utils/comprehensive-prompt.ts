/**
 * Builds the AI prompt for comprehensive resume analysis.
 * Returns a structured JSON response matching ComprehensiveAnalysisDTO.
 */
export function buildComprehensiveAnalysisPrompt(
  resumeContent: string,
  jobDescription?: string,
): string {
  const jobContext = jobDescription
    ? `\n## Target Job Description:\n${jobDescription}\n\nUse the job description above as additional context to assess the relevance of keywords, skills, and experience in the analysis result (using the same language as the resume).`
    : "";

  return `
Kamu adalah AI expert analisis resume/CV internasional. Tugas Anda adalah memberikan analisis resume yang sangat komprehensif dan mendalam.

## Resume yang Dianalisis:
${resumeContent}
${jobContext}

## Instruksi:
- Deteksi bahasa yang digunakan dalam resume (Utamanya Bahasa Inggris atau Bahasa Indonesia).
- Berikan analisis lengkap dalam format JSON berikut menggunakan bahasa yang sama dengan resume tersebut. Jika resume dalam Bahasa Inggris, gunakan Bahasa Inggris. Jika resume dalam Bahasa Indonesia, gunakan Bahasa Indonesia.

{
  "overallScore": {
    "total": <0-100>,
    "grade": "<A+, A, B+, B, C+, C, D>",
    "label": "<Luar Biasa | Sangat Baik | Cukup Baik | Perlu Perbaikan | Kurang>",
    "summary": "<2-3 kalimat feedback umum>"
  },
  "atsCompatibility": {
    "score": <0-100>,
    "passed": <true|false>,
    "checks": [
      {
        "category": "<nama kategori cek>",
        "status": "<pass|warning|fail>",
        "message": "<penjelasan>",
        "suggestion": "<saran perbaikan, atau string kosong jika sudah baik>"
      }
    ]
  },
  "sectionScores": [
    {
      "section": "<nama section>",
      "score": <0-100>,
      "status": "<excellent|good|needs_work|poor>",
      "feedback": "<feedback>",
      "missing": ["<hal yang kurang, atau array kosong jika tidak ada>"],
      "suggestion": "<saran perbaikan, atau string kosong jika sudah baik>"
    }
  ],
  "contentQuality": {
    "score": <0-100>,
    "bulletPoints": {
      "score": <0-100>,
      "total": <jumlah>,
      "withActionVerb": <jumlah>,
      "withMetric": <jumlah>,
      "tooShort": <jumlah>,
      "tooLong": <jumlah>,
      "feedback": "<feedback>",
      "examples": {
        "before": "<contoh lemah>",
        "after": "<perbaikan>"
      } // atau null jika tidak ada contoh yang relevan
    },
    "actionVerbs": {
      "score": <0-100>,
      "found": ["<verb kuat>"],
      "weak": ["<verb lemah>"],
      "suggestions": ["<saran verb>"]
    },
    "length": {
      "pageCount": <jumlah>,
      "wordCount": <jumlah>,
      "status": "<too_short|good|too_long>",
      "feedback": "<feedback>"
    },
    "writingQuality": {
      "score": <0-100>,
      "typosFound": <jumlah>,
      "issues": [
        { "text": "<salah>", "suggestion": "<benar>" }
      ]
    }
  },
  "keywordAnalysis": {
    "score": <0-100>,
    "found": [
      { "keyword": "<keyword>", "count": <frekuensi>, "relevance": "<high|medium|low>" }
    ],
    "suggested": [
      { "keyword": "<keyword>", "priority": "<high|medium|low>", "reason": "<alasan>" }
    ],
    "overused": [
      { "keyword": "<keyword>", "reason": "<alasan>" }
    ]
  },
  "redFlags": [
    {
      "severity": "<high|medium|low>",
      "title": "<judul>",
      "description": "<penjelasan>",
      "suggestion": "<saran>",
      "highlightText": "<teks spesifik, atau string kosong jika tidak ada teks spesifik>"
    }
  ],
  "strengths": ["<kekuatan>"],
  "actionItems": [
    {
      "priority": <1-5>,
      "impact": "<high|medium|low>",
      "effort": "<low|medium|high>",
      "title": "<judul>",
      "description": "<penjelasan>",
      "estimatedTime": "<waktu>"
    }
  ],
  "competitiveInsight": {
    "percentile": <0-100>,
    "topMissingElements": ["<elemen, atau array kosong jika tidak ada>"]
  },
  "highlights": [
    {
      "text": "<teks PERSIS dari resume>",
      "type": "<red_flag|weak_verb|typo|keyword_found|overused>",
      "tooltip": "<penjelasan>"
    }
  ]
}

## Penting:
- SEMUA field dalam JSON di atas WAJIB diisi (tidak boleh dihilangkan).
- Jika sebuah field tidak memiliki data atau tidak relevan, gunakan string kosong "", array kosong [], atau null (untuk object examples).
- Masukkan teks PERSIS seperti yang tertulis di resume (case-sensitive) untuk highlights.
- Minimal berikan 5-10 highlights.


Hanya kembalikan JSON yang valid, tanpa teks lain.
`;
}
