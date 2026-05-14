"use server";

import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { resumeAnalyses } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

import type { ComprehensiveAnalysisDTO } from "../types/resume-analyzer-dto";

export type AnalysisHistoryItem = {
  id: string;
  createdAt: Date;
  overallScore: number;
  result: ComprehensiveAnalysisDTO;
};

/**
 * Fetches the analysis history for a specific resume.
 */
export async function getAnalysisHistory(
  resumeId: string,
): Promise<ActionResult<AnalysisHistoryItem[]>> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const logs = await db
      .select({
        id: resumeAnalyses.id,
        createdAt: resumeAnalyses.createdAt,
        overallScore: resumeAnalyses.overallScore,
        result: resumeAnalyses.result,
      })
      .from(resumeAnalyses)
      .where(
        and(
          eq(resumeAnalyses.userId, user.id),
          eq(resumeAnalyses.resumeId, resumeId),
        ),
      )
      .orderBy(desc(resumeAnalyses.createdAt));

    const history: AnalysisHistoryItem[] = logs.map((log) => ({
      id: log.id,
      createdAt: log.createdAt,
      overallScore: log.overallScore,
      result: log.result as ComprehensiveAnalysisDTO,
    }));

    return { success: true, data: history };
  } catch (error) {
    console.error("Fetch history error:", error);
    return { success: false, error: "Gagal memuat riwayat analisis" };
  }
}
