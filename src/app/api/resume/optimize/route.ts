import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text, type, context } = await req.json();

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    let prompt = "";

    switch (type) {
      case "optimize":
        prompt = `You are a professional resume writer. Optimize the following bullet point to be more impactful, professional, and clear. 
        Use strong action verbs and professional language. Keep it to a single concise sentence.
        
        Original: "${text}"
        Context: ${context || "Work Experience"}
        
        Return only the optimized text, no explanations.`;
        break;

      case "quantify":
        prompt = `You are a professional resume writer. Add quantifiable metrics or achievements to the following bullet point to make it more impressive. 
        If specific numbers aren't provided, suggest realistic placeholders in brackets like [X%].
        
        Original: "${text}"
        
        Return only the enhanced text, no explanations.`;
        break;

      case "grammar":
        prompt = `Fix the grammar and spelling of the following text while maintaining its meaning.
        
        Text: "${text}"
        
        Return only the corrected text, no explanations.`;
        break;

      default:
        prompt = `Optimize this resume text: "${text}"`;
    }

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
