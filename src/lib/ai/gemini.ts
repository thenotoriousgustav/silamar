import { generateObject } from "ai";
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
