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
You are an international AI expert in resume/CV analysis. Your task is to provide a highly comprehensive and in-depth resume analysis.

## Resume to Analyze:
${resumeContent}
${jobContext}

## Instructions:
- Detect the language used in the resume (primarily English or Indonesian).
- Provide a complete analysis in the following JSON format using the same language as the resume. If the resume is in English, use English. If the resume is in Indonesian, use Indonesian.

{
  "overallScore": {
    "total": <0-100>,
    "grade": "<A+, A, B+, B, C+, C, D>",
    "label": "<Outstanding | Excellent | Good | Needs Improvement | Poor>",
    "summary": "<2-3 sentences of general feedback>"
  },
  "atsCompatibility": {
    "score": <0-100>,
    "passed": <true|false>,
    "checks": [
      {
        "category": "<check category name>",
        "status": "<pass|warning|fail>",
        "message": "<explanation>",
        "suggestion": "<improvement suggestion, or empty string if already good>"
      }
    ]
  },
  "sectionScores": [
    {
      "section": "<section name>",
      "score": <0-100>,
      "status": "<excellent|good|needs_work|poor>",
      "feedback": "<feedback>",
      "missing": ["<missing item, or empty array if none>"],
      "suggestion": "<improvement suggestion, or empty string if already good>"
    }
  ],
  "contentQuality": {
    "score": <0-100>,
    "bulletPoints": {
      "score": <0-100>,
      "total": <count>,
      "withActionVerb": <count>,
      "withMetric": <count>,
      "tooShort": <count>,
      "tooLong": <count>,
      "feedback": "<feedback>",
      "examples": {
        "before": "<weak example>",
        "after": "<improved version>"
      } // or null if no relevant example
    },
    "actionVerbs": {
      "score": <0-100>,
      "found": ["<strong verb>"],
      "weak": ["<weak verb>"],
      "suggestions": ["<suggested verb>"]
    },
    "length": {
      "pageCount": <count>,
      "wordCount": <count>,
      "status": "<too_short|good|too_long>",
      "feedback": "<feedback>"
    },
    "writingQuality": {
      "score": <0-100>,
      "typosFound": <count>,
      "issues": [
        { "text": "<incorrect>", "suggestion": "<correct>" }
      ]
    }
  },
  "keywordAnalysis": {
    "score": <0-100>,
    "found": [
      { "keyword": "<keyword>", "count": <frequency>, "relevance": "<high|medium|low>" }
    ],
    "suggested": [
      { "keyword": "<keyword>", "priority": "<high|medium|low>", "reason": "<reason>" }
    ],
    "overused": [
      { "keyword": "<keyword>", "reason": "<reason>" }
    ]
  },
  "redFlags": [
    {
      "severity": "<high|medium|low>",
      "title": "<title>",
      "description": "<explanation>",
      "suggestion": "<suggestion>",
      "highlightText": "<specific text from resume, or empty string if none>"
    }
  ],
  "strengths": ["<strength>"],
  "actionItems": [
    {
      "priority": <1-5>,
      "impact": "<high|medium|low>",
      "effort": "<low|medium|high>",
      "title": "<title>",
      "description": "<explanation>",
      "estimatedTime": "<time estimate>"
    }
  ],
  "competitiveInsight": {
    "percentile": <0-100>,
    "topMissingElements": ["<element, or empty array if none>"]
  },
  "highlights": [
    {
      "text": "<EXACT text from the resume>",
      "type": "<red_flag|weak_verb|typo|keyword_found|overused>",
      "tooltip": "<explanation>"
    }
  ]
}

## Important:
- ALL fields in the JSON above MUST be filled (none may be omitted).
- If a field has no data or is not relevant, use an empty string "", empty array [], or null (for object examples).
- Enter text EXACTLY as written in the resume (case-sensitive) for highlights.
- Provide a minimum of 5-10 highlights.

Return only valid JSON, no other text.
`;
}
