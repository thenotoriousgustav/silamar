import { analyzeComprehensive } from "@/features/resume-analysis/actions/analyze-comprehensive";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeId } = body;

    if (!resumeId || typeof resumeId !== "string") {
      return Response.json({ error: "resumeId is required" }, { status: 400 });
    }

    const result = await analyzeComprehensive({ resumeId });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json({ data: result.data });
  } catch (error) {
    console.error("Comprehensive analysis API error:", error);
    return Response.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
