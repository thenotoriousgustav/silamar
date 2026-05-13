import type { ActionResult } from "@/types/action-result";

export type RetryConfig = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
};

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
};

export async function resilientFetch<T>(
  url: string,
  options: RequestInit,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
): Promise<ActionResult<T>> {
  let lastError: string = "Unknown error";

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);

      // 4xx errors: return immediately, no retry
      if (response.status >= 400 && response.status < 500) {
        return { success: false, error: `Client error: ${response.status}` };
      }

      // 5xx errors: retry with backoff
      if (response.status >= 500) {
        lastError = `Server error: ${response.status}`;
        const delay = Math.min(
          config.baseDelayMs * Math.pow(2, attempt),
          config.maxDelayMs,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      const data = await response.json();
      return { success: true, data: data as T };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Network error";
      const delay = Math.min(
        config.baseDelayMs * Math.pow(2, attempt),
        config.maxDelayMs,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { success: false, error: lastError };
}
