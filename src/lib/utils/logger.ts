export type LogContext = {
  userId?: string;
  action: string;
  input?: string;
};

const SENSITIVE_PATTERNS = [
  /password/gi,
  /token/gi,
  /secret/gi,
  /api.?key/gi,
  /card.?number/gi,
  /cvv/gi,
];

export function sanitizeInput(input: unknown): string {
  const str = JSON.stringify(input) ?? "";
  const truncated = str.slice(0, 200);

  return SENSITIVE_PATTERNS.reduce(
    (acc, pattern) => acc.replace(pattern, "[REDACTED]"),
    truncated,
  );
}

export function logError(error: unknown, context: LogContext): void {
  const message = error instanceof Error ? error.message : "Unknown error";

  console.error(
    JSON.stringify({
      level: "error",
      timestamp: new Date().toISOString(),
      message,
      userId: context.userId,
      action: context.action,
      input: context.input ? sanitizeInput(context.input) : undefined,
    }),
  );
}
