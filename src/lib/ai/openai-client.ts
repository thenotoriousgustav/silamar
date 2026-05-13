import { generateText, streamText } from "ai";

import type { AiClient } from "./types";

import { defaultModel } from "./index";

/**
 * Factory function that creates an OpenAI-backed AiClient.
 * Uses the project's configured default model (gpt-4.1-nano).
 * Designed for dependency injection — swap with a mock in tests.
 */
export function createOpenAiClient(): AiClient {
  return {
    async generateText({ prompt, maxTokens }) {
      const result = await generateText({
        model: defaultModel,
        prompt,
        maxOutputTokens: maxTokens,
      });
      return result.text;
    },
    async *streamText({ prompt }) {
      const result = streamText({
        model: defaultModel,
        prompt,
      });
      for await (const chunk of result.textStream) {
        yield chunk;
      }
    },
  };
}
