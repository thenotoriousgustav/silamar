"use client";

import { useMemo } from "react";

import type { ResumeContent } from "@/types/resume";

import type { JobFitDTO } from "../../schemas/job-fit";
import type { HighlightAnnotation } from "../../types/resume-analyzer-dto";
import { HighlightedResumePreview } from "../highlighted-resume-preview";

interface JobFitResumePreviewProps {
  content: ResumeContent;
  data: JobFitDTO;
  activeHighlight?: string | null;
}

/**
 * Reuses the existing HighlightedResumePreview but maps JobFitDTO findings
 * onto its highlight annotation types so the user can SEE which parts of the
 * resume already match the job, and which keywords are missing.
 */
export function JobFitResumePreview({
  content,
  data,
  activeHighlight,
}: JobFitResumePreviewProps) {
  const highlights = useMemo<HighlightAnnotation[]>(() => {
    const items: HighlightAnnotation[] = [];

    // Matched keywords → green "keyword_found"
    for (const k of data.keywordMatch.matched) {
      if (k.keyword.trim().length < 2) continue;
      items.push({
        text: k.keyword,
        type: "keyword_found",
        tooltip: `Cocok dengan job description${
          k.frequency > 1 ? ` · ${k.frequency}x disebut` : ""
        }`,
      });
    }

    // Matched skills evidence → green "keyword_found"
    for (const m of data.skillsAnalysis.matched) {
      if (m.skill.trim().length < 2) continue;
      items.push({
        text: m.skill,
        type: "keyword_found",
        tooltip: `Skill cocok (${
          m.importance === "must_have" ? "wajib" : "plus"
        })${m.evidence ? ` — ${m.evidence}` : ""}`,
      });
    }

    return items;
  }, [data]);

  return (
    <HighlightedResumePreview
      content={content}
      highlights={highlights}
      activeHighlight={activeHighlight}
    />
  );
}
