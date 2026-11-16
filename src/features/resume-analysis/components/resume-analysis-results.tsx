"use client";

import { AlertCircle, CheckCircle } from "lucide-react";

import type { ResumeAnalysisDTO } from "../types/resume-analysis-dto";

type ResumeAnalysisResultsProps = {
  result: ResumeAnalysisDTO;
};

export function ResumeAnalysisResults({ result }: ResumeAnalysisResultsProps) {
  return (
    <>
      {/* ATS Score */}
      <div className="glass rounded-none p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Skor ATS</h3>
          <span
            className={`text-3xl font-extrabold ${scoreColor(result.atsScore)}`}
          >
            {result.atsScore}%
          </span>
        </div>
        <div className="bg-surface-700 mb-3 h-2 overflow-hidden rounded-none">
          <div
            className={`h-full rounded-none transition-all duration-1000 ${scoreBg(result.atsScore)}`}
            style={{ width: `${result.atsScore}%` }}
          />
        </div>
        <p className="text-surface-300 text-sm">{result.overallFeedback}</p>
      </div>

      {/* Section Scores */}
      <div className="glass rounded-none p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Skor per Seksi
        </h3>
        <div className="space-y-3">
          {Object.entries(result.sectionScores).map(([section, score]) => (
            <div key={section} className="flex items-center gap-3">
              <span className="text-surface-300 w-24 text-xs capitalize">
                {section}
              </span>
              <div className="bg-surface-700 h-1.5 flex-1 overflow-hidden rounded-none">
                <div
                  className={`h-full rounded-none ${scoreBg(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span
                className={`w-10 text-right text-xs font-medium ${scoreColor(score)}`}
              >
                {score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="glass rounded-none p-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          Kekuatan
        </h3>
        <ul className="space-y-2">
          {result.strengths.map((s, i) => (
            <li
              key={i}
              className="text-surface-300 flex items-start gap-2 text-sm"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-none bg-emerald-400" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="glass rounded-none p-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          Perlu Diperbaiki
        </h3>
        <ul className="space-y-2">
          {result.improvements.map((s, i) => (
            <li
              key={i}
              className="text-surface-300 flex items-start gap-2 text-sm"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-none bg-amber-400" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Keywords */}
      <div className="glass rounded-none p-6">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Keyword yang Disarankan
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.keywordSuggestions.map((kw) => (
            <span
              key={kw}
              className="bg-brand-500/10 text-brand-400 rounded-none px-3 py-1 text-xs font-medium"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}
