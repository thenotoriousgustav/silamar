/**
 * AI service client interface for dependency injection.
 * Implementations can be swapped for testing or alternative providers.
 */
export interface AiClient {
  generateText(params: { prompt: string; maxTokens: number }): Promise<string>;
  streamText(params: { prompt: string }): AsyncIterable<string>;
}
