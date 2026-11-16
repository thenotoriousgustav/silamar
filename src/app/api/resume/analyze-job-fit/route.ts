import { analyzeJobFit } from "@/features/resume-analysis/actions/analyze-job-fit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await analyzeJobFit(body);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json({ data: result.data });
  } catch (error) {
    console.error("Job fit analysis API error:", error);
    return Response.json(
      { error: "Failed to analyze resume against job" },
      { status: 500 },
    );
  }
}
