import type { SessionUser } from "@/lib/auth/session";

/**
 * Creates a mock SessionUser with sensible defaults.
 * Override any field by passing partial overrides.
 */
export function createMockSessionUser(
  overrides: Partial<SessionUser> = {},
): SessionUser {
  return {
    id: "test-user-id-123",
    email: "test@example.com",
    name: "Test User",
    image: null,
    credits: 10,
    plan: "free",
    planExpiresAt: null,
    ...overrides,
  };
}

/**
 * Returns null, representing an unauthenticated session.
 * Useful for testing auth guard behavior.
 */
export function createNullSession(): null {
  return null;
}
