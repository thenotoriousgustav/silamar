import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "nodejs";

/**
 * Builds an AI prompt based on the optimization type requested.
 * Supports: "optimize" (improve impact), "quantify" (add metrics),
 * "grammar" (fix errors), or a generic fallback.
 */
function buildOptimizationPrompt(
  text: string,
  type: string,
  context?: string,
): string {
  switch (type) {
    case "optimize":
      return `You are a professional resume writer. Optimize the following bullet point to be more impactful, professional, and clear. 
        Use strong action verbs and professional language. Keep it to a single concise sentence.
        
        Original: "${text}"
        Context: ${context || "Work Experience"}
        
        Return only the optimized text, no explanations.`;

    case "quantify":
      return `You are a professional resume writer. Add quantifiable metrics or achievements to the following bullet point to make it more impressive. 
        If specific numbers aren't provided, suggest realistic placeholders in brackets like [X%].
        
        Original: "${text}"
        
        Return only the enhanced text, no explanations.`;

    case "grammar":
      return `Fix the grammar and spelling of the following text while maintaining its meaning.
        
        Text: "${text}"
        
        Return only the corrected text, no explanations.`;

    default:
      return `Optimize this resume text: "${text}"`;
  }
}

export async function POST(req: Request) {
  try {
    const { text, type, context } = await req.json();

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const prompt = buildOptimizationPrompt(text, type, context);

    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    });

    return Response.json({ result: result.replace(/^"|"$/g, "") });
  } catch (error) {
    console.error("Optimization error:", error);
    return Response.json({ error: "Failed to optimize text" }, { status: 500 });
  }
}
