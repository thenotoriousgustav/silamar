import { generateObject, type GenerateObjectResult } from "ai";
import { defaultModel } from "./index";
import { z } from "zod";

/**
 * Call AI model with a prompt and return parsed JSON using Vercel AI SDK
 */
export async function callAI<T>(
  prompt: string,
  schema: z.ZodType<T>
): Promise<T> {
  const { object } = await generateObject({
    model: defaultModel,
    schema,
    prompt,
  });

  return object;
}

// Keep callGemini as an alias for backward compatibility or refactor existing calls
export async function callGemini<T>(
  prompt: string,
): Promise<T> {
  // Note: Since we are migrating to Vercel AI SDK, we need the schema.
  // In the transition, we might need to handle this differently or refactor all calls.
  // For now, this is a placeholder that might fail if called without a schema refactor.
  throw new Error("callGemini is deprecated. Use callAI(prompt, schema) instead.");
}
