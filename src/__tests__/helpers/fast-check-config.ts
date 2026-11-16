import type { Parameters } from "fast-check";

/**
 * Default fast-check configuration for property-based tests.
 * Ensures a minimum of 100 iterations per property test as specified
 * in the design document.
 */
export const DEFAULT_FC_PARAMS: Parameters<unknown> = {
  numRuns: 100,
  verbose: false,
};

/**
 * Wraps fast-check parameters with the project's default configuration.
 * Use this to ensure consistent iteration counts across all property tests.
 *
 * @example
 * ```ts
 * import { fc } from "fast-check";
 * import { withFastCheckConfig } from "@/__tests__/helpers";
 *
 * fc.assert(
 *   fc.property(fc.string(), (s) => {
 *     // property assertion
 *   }),
 *   withFastCheckConfig()
 * );
 * ```
 */
export function withFastCheckConfig<T>(
  overrides: Partial<Parameters<T>> = {},
): Parameters<T> {
  return {
    ...DEFAULT_FC_PARAMS,
    ...overrides,
  } as Parameters<T>;
}
