# Implementation Plan: Enterprise Architecture Refactor

## Overview

This plan refactors the SiLamar application into a fully modular, type-safe, enterprise-grade architecture. The implementation proceeds in logical phases: foundational types and configuration first, then shared infrastructure, feature module standardization, presentation layer cleanup, and finally architectural enforcement via ESLint and testing.

## Tasks

- [x] 1. Foundation — Shared types, configuration, and core infrastructure
  - [x] 1.1 Create standard ActionResult type and AsyncState discriminated union
    - Create `src/types/action-result.ts` with `ActionResult<T>` discriminated union type
    - Create `src/types/async-state.ts` with `AsyncState<T, E>` discriminated union using literal `status` field (`"idle"`, `"loading"`, `"error"`, `"success"`)
    - Export both from `src/types/index.ts` barrel
    - _Requirements: 3.7, 8.1_

  - [x] 1.2 Create environment variable validation module
    - Create `src/config/env.ts` with Zod schema validating all required env vars (DATABASE_URL, BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OPENAI_API_KEY, MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, UPLOADTHING_TOKEN, NEXT_PUBLIC_APP_URL, RESEND_API_KEY)
    - Implement `validateEnv()` that calls `process.exit(1)` with descriptive error messages naming each missing/invalid variable
    - Export `env` constant as the sole access point for environment variables
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 1.3 Centralize session retrieval with getSessionUser
    - Create `src/lib/auth/session.ts` with `getSessionUser()` wrapped in React `cache()`
    - Define `SessionUser` type with id, email, name, credits, plan, planExpiresAt fields
    - Use `server-only` import to prevent client-side usage
    - Ensure it uses `auth.api.getSession` with `headers()` from `next/headers`
    - _Requirements: 6.3, 8.4_

  - [x] 1.4 Create resilientFetch HTTP client with exponential backoff
    - Create `src/lib/http/resilient-fetch.ts` with configurable retry logic
    - Implement exponential backoff: 1s base delay, doubling each attempt, max 8s, max 3 attempts
    - Return `ActionResult<T>` — immediately return error on 4xx, retry on 5xx/network errors
    - Accept `RetryConfig` parameter with sensible defaults
    - _Requirements: 11.3, 11.4_

  - [x] 1.5 Create structured error logger with sanitization
    - Create `src/lib/utils/logger.ts` with `logError(error, context)` function
    - Implement `sanitizeInput()` that redacts patterns matching password, token, secret, API key, card number
    - Truncate input to 200 characters
    - Output structured JSON with level, timestamp, message, userId, action, sanitized input
    - _Requirements: 11.5, 11.6_

  - [ ]* 1.6 Write property tests for environment validation (Properties 5, 6)
    - **Property 5: Environment validation identifies all missing variables**
    - **Property 6: Environment validation identifies format violations**
    - **Validates: Requirements 9.1, 9.2, 9.3**

  - [ ]* 1.7 Write property tests for resilientFetch (Properties 7, 8)
    - **Property 7: Retry logic follows exponential backoff for 5xx errors**
    - **Property 8: No retry on 4xx client errors**
    - **Validates: Requirements 11.3, 11.4**

  - [ ]* 1.8 Write property tests for error logger (Property 9)
    - **Property 9: Error logs exclude sensitive data**
    - **Validates: Requirements 11.5**

  - [ ]* 1.9 Write property test for AsyncState type (Property 13)
    - **Property 13: Async state discriminated union has exactly one valid variant**
    - **Validates: Requirements 3.7**

- [x] 2. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Feature module standardization — Actions, queries, types, schemas
  - [x] 3.1 Standardize resume-builder feature module structure
    - Create `src/features/resume-builder/types/` with `resume-dto.ts` and `resume-content.ts`
    - Create `src/features/resume-builder/schemas.ts` with Zod schemas for create/update resume
    - Refactor `actions.ts` into `src/features/resume-builder/actions/` directory with individual action files
    - Refactor `queries.ts` into `src/features/resume-builder/queries/` directory with individual query files using column-specific `select()` clauses
    - Each action: validate with Zod, check auth via `getSessionUser()`, return `ActionResult<T>`, call `revalidatePath` on mutation
    - Create `src/features/resume-builder/index.ts` barrel export
    - _Requirements: 1.1, 1.2, 1.5, 2.6, 3.5, 4.5, 8.1, 8.2, 8.4, 8.5, 10.5_

  - [x] 3.2 Standardize cover-letter-builder feature module structure
    - Create `types/`, `schemas.ts`, split `actions/` and `queries/` directories
    - Apply same patterns: Zod validation, `getSessionUser()`, `ActionResult<T>`, column-specific selects, DTO mapping
    - Create barrel export `index.ts`
    - _Requirements: 1.1, 1.2, 1.5, 2.6, 3.5, 4.5, 8.1, 8.2, 8.4, 8.5, 10.5_

  - [x] 3.3 Standardize job-tracker feature module structure
    - Create `types/`, `schemas.ts`, split `actions/` and `queries/` directories
    - Apply same patterns: Zod validation, `getSessionUser()`, `ActionResult<T>`, column-specific selects, DTO mapping
    - Create barrel export `index.ts`
    - _Requirements: 1.1, 1.2, 1.5, 2.6, 3.5, 4.5, 8.1, 8.2, 8.4, 8.5, 10.5_

  - [x] 3.4 Standardize resumes-list feature module structure
    - Create `types/` with `ResumeListItemDTO`, split queries with column-specific selects
    - Implement pagination with max 50 records per request
    - Create barrel export `index.ts`
    - _Requirements: 1.1, 1.2, 1.5, 2.6, 4.5, 4.6, 10.5_

  - [x] 3.5 Standardize cover-letters-list feature module structure
    - Create `types/` with `CoverLetterListItemDTO`, split queries with column-specific selects
    - Implement pagination with max 50 records per request
    - Create barrel export `index.ts`
    - _Requirements: 1.1, 1.2, 1.5, 2.6, 4.5, 4.6, 10.5_

  - [x] 3.6 Create resume-analysis feature module
    - Create `src/features/resume-analysis/` with components, actions, types, schemas
    - Move resume analysis logic from app directory into feature module
    - Apply standard patterns (Zod, auth, ActionResult, DTO)
    - Create barrel export `index.ts`
    - _Requirements: 1.1, 1.2, 1.5, 2.6, 3.5, 8.1_

  - [x] 3.7 Create billing feature module
    - Create `src/features/billing/` with types, actions, queries, schemas
    - Define `TransactionDTO` type
    - Move billing/payment logic into feature module
    - Apply standard patterns (Zod, auth, ActionResult, DTO)
    - Create barrel export `index.ts`
    - _Requirements: 1.1, 1.2, 1.5, 2.6, 3.5, 8.1_

  - [x] 3.8 Create auth feature module
    - Create `src/features/auth/` with components, types, schemas
    - Move auth-specific UI components and schemas from `src/app/(auth)/` into feature module
    - Keep `src/lib/auth/` as the shared auth service layer
    - Create barrel export `index.ts`
    - _Requirements: 1.1, 1.2, 1.5, 1.6_

  - [ ]* 3.9 Write property tests for server action validation (Properties 1, 2)
    - **Property 1: Validation schema rejects invalid input and returns typed error**
    - **Property 2: Validation schema accepts validWe  input and preserves data**
    - Test each feature's Zod schemas with fast-check arbitraries
    - **Validates: Requirements 3.3, 3.4, 3.5, 8.1, 8.2**

  - [ ]* 3.10 Write property tests for server action auth and response type (Properties 3, 4)
    - **Property 3: Unauthenticated requests are rejected before business logic**
    - **Property 4: Server actions always return standard ActionResult type**
    - **Validates: Requirements 8.1, 8.2, 8.4**

  - [ ]* 3.11 Write property tests for pagination and DTO mapping (Properties 11, 12)
    - **Property 11: Paginated queries never exceed maximum page size**
    - **Property 12: DTO mapping excludes internal database fields**
    - **Validates: Requirements 2.6, 4.6**

  - [ ]* 3.12 Write property test for database error messages (Property 10)
    - **Property 10: Database errors return generic messages**
    - **Validates: Requirements 11.6**

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Service layer and dependency injection
  - [x] 5.1 Create AI service interface and OpenAI implementation
    - Create `src/lib/ai/types.ts` with `AiClient` interface (generateText, streamText)
    - Create `src/lib/ai/openai-client.ts` implementing `AiClient` using AI SDK
    - Export factory function `createOpenAiClient()` for dependency injection
    - _Requirements: 2.3, 6.6_

  - [x] 5.2 Create payment service interface and implementations
    - Create `src/lib/payment/types.ts` with `PaymentClient` interface
    - Create Midtrans implementation with `resilientFetch` for external calls
    - Export factory function for dependency injection
    - _Requirements: 2.3, 6.6, 11.3, 11.4_

  - [x] 5.3 Create storage service interface and implementation
    - Create `src/lib/storage/types.ts` with `StorageClient` interface
    - Create UploadThing/S3 implementation
    - Export factory function for dependency injection
    - _Requirements: 2.3, 6.6_

  - [x] 5.4 Create email service interface and implementation
    - Create `src/lib/email/types.ts` with `EmailClient` interface
    - Create Resend implementation
    - Export factory function for dependency injection
    - _Requirements: 2.3, 6.6_

  - [x] 5.5 Replace direct process.env access with env module
    - Search all files for `process.env` usage outside `src/config/env.ts`
    - Replace each occurrence with import from `@/config/env`
    - Ensure `env` is the sole access point for environment variables
    - _Requirements: 9.5_

- [x] 6. Presentation layer cleanup and optimization
  - [x] 6.1 Add error.tsx and not-found.tsx boundaries for each route group
    - Create `src/app/(auth)/error.tsx` with retry action and dashboard link
    - Create `src/app/(auth)/not-found.tsx` with navigation links
    - Create `src/app/(dashboard)/error.tsx` with retry action and dashboard link
    - Create `src/app/(dashboard)/not-found.tsx` with back link and dashboard link
    - Create `src/app/(marketing)/error.tsx` and `not-found.tsx`
    - _Requirements: 11.1, 11.2_

  - [x] 6.2 Add loading.tsx Suspense boundaries for async route segments
    - Create `src/app/(dashboard)/loading.tsx` with skeleton placeholder
    - Create `src/app/(dashboard)/resume-builder/[id]/loading.tsx`
    - Create `src/app/(dashboard)/cover-letter-builder/[id]/loading.tsx`
    - Create `src/app/(dashboard)/documents/resumes/loading.tsx`
    - Create `src/app/(dashboard)/documents/cover-letter/loading.tsx`
    - Create `src/app/(dashboard)/job-tracker/loading.tsx`
    - Create `src/app/(dashboard)/resume-analysis/loading.tsx`
    - Ensure all loading states render non-empty skeletons matching expected layout dimensions
    - _Requirements: 10.4, 10.7, 12.1_

  - [x] 6.3 Implement dynamic imports for heavy client components
    - Use `next/dynamic` for `@react-pdf/renderer` components (PDF preview)
    - Use `next/dynamic` for Lexical editor components
    - Ensure each dynamic import has a loading placeholder (skeleton/spinner)
    - _Requirements: 10.1, 10.2, 10.7_

  - [x] 6.4 Refactor page components for Server Component data fetching
    - Ensure all page.tsx files fetch data as async Server Components
    - Pass data as props to Client Components
    - Use `Promise.all` for parallel independent data fetches
    - Use `notFound()` when required resources are missing
    - Remove any direct DB imports from component files
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.7, 2.5, 2.7_

  - [x] 6.5 Implement React cache() for deduplicated data fetching
    - Wrap shared query functions with `cache()` for request-level deduplication
    - Apply to `getSessionUser` (already done) and frequently-called queries
    - _Requirements: 4.5_

  - [x] 6.6 Update dynamic route pages to use async params pattern
    - Update all `[id]` pages to use `params: Promise<{ id: string }>` and await before access
    - Update any `searchParams` usage to async pattern
    - _Requirements: 12.2_

  - [x] 6.7 Implement metadata exports for SEO
    - Add `metadata` or `generateMetadata` exports to all page files with user-visible titles
    - Use static `metadata` for fixed pages, `generateMetadata` for dynamic pages
    - _Requirements: 12.5_

- [x] 7. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Dead code elimination and code hygiene
  - [x] 8.1 Remove debug routes and dead code
    - Delete `src/app/api/debug-db/` directory entirely
    - Remove any other debug/test/dev-only routes without auth guards
    - Remove unused imports, variables, and unreachable code across all files
    - Remove commented-out code blocks (2+ consecutive lines of valid code)
    - Delete files that contain only dead code
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 8.2 Remove unnecessary force-dynamic directives
    - Search for `export const dynamic = "force-dynamic"` across all route segments
    - Remove where Next.js can auto-detect dynamic rendering (usage of cookies(), headers(), uncached fetch)
    - Retain only where no dynamic API is called but dynamic behavior is still required
    - _Requirements: 12.6_

  - [x] 8.3 Enforce code readability standards
    - Refactor functions exceeding 30 lines of logic into smaller helper functions
    - Flatten nested conditionals deeper than 2 levels using guard clauses
    - Convert functions with >3 parameters to use configuration object parameter
    - Add JSDoc comments to complex functions (>3 conditional branches or non-obvious transformations)
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.7_

  - [x] 8.4 Decompose oversized components
    - Identify components with >5 props and decompose into smaller components
    - Ensure composition over inheritance (children prop, render props, compound patterns)
    - Extract repeated logic blocks (3+ statements in 2+ locations) into shared utilities
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ] 9. ESLint architectural enforcement
  - [x] 9.1 Update ESLint config with comprehensive architectural rules
    - Add rules to prevent component files from importing `db/`, `drizzle-orm`, or query files
    - Add rule to prevent direct `process.env` access outside `src/config/env.ts`
    - Ensure `import/no-restricted-paths` covers all feature modules (including new ones: resume-analysis, billing, auth)
    - Upgrade `@typescript-eslint/no-unused-vars` from "warn" to "error"
    - Add `no-any` rule (or `@typescript-eslint/no-explicit-any`) at "error" level
    - Add max function length rule (30 lines)
    - Add max nesting depth rule (2 levels)
    - Ensure `import/order` rule enforces newlines between groups
    - _Requirements: 1.3, 1.4, 1.7, 2.2, 2.5, 3.2, 5.1, 7.3, 7.4, 7.6, 9.5_

  - [-] 9.2 Fix all ESLint violations introduced by new rules
    - Run `pnpm lint` and fix all errors
    - Replace any remaining `any` types with proper types
    - Fix import order violations
    - Ensure zero lint errors across the codebase
    - _Requirements: 3.2, 5.1, 5.2, 7.4, 7.6_

- [x] 10. Testing infrastructure setup
  - [x] 10.1 Set up Vitest and fast-check testing framework
    - Install `vitest` and `fast-check` as dev dependencies
    - Create `vitest.config.ts` with path aliases matching tsconfig
    - Configure minimum 100 iterations for property tests
    - Create test helper utilities (mock factories, test fixtures)
    - Add `"test": "vitest --run"` script to package.json
    - _Requirements: Design testing strategy_

  - [ ]* 10.2 Write unit tests for server action happy paths
    - Test each feature's primary actions with concrete examples
    - Verify cache invalidation calls after mutations
    - Test error responses for invalid inputs
    - _Requirements: 8.1, 8.2, 8.5_

  - [ ]* 10.3 Write unit tests for error boundaries and loading states
    - Test error.tsx components render retry button and dashboard link
    - Test not-found.tsx components render navigation links
    - Test loading.tsx components render non-empty skeletons
    - _Requirements: 11.1, 11.2, 10.4_

- [x] 11. Final integration and wiring
  - [x] 11.1 Wire all feature modules into app router pages
    - Update all page.tsx files to import from feature barrel exports
    - Ensure no page directly imports from feature internals (only from index.ts)
    - Verify all routes render correctly with new module structure
    - _Requirements: 1.5, 2.7_

  - [x] 11.2 Verify TypeScript strict mode compliance
    - Ensure `tsconfig.json` has `strict: true` with `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`
    - Run `pnpm build` to verify zero type errors
    - _Requirements: 3.1, 3.2_

  - [x] 11.3 Validate Next.js configuration
    - Ensure `next.config.ts` is typed as `NextConfig`
    - Verify image optimization configuration
    - Confirm caching strategies are configured for infrequently-changing data
    - _Requirements: 12.3, 10.3, 10.6_

- [~] 12. Final checkpoint — Ensure all tests pass and build succeeds
  - Run `pnpm lint`, `pnpm build`, and `pnpm test` to verify zero errors.
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation between major phases
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The refactoring is non-destructive to user-facing functionality — it reorganizes and standardizes without changing business behavior
- All code examples use TypeScript as specified in the design document
- Feature modules that already exist (resume-builder, cover-letter-builder, job-tracker, resumes-list, cover-letters-list) are refactored in-place; new modules (resume-analysis, billing, auth) are created fresh

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5"] },
    { "id": 1, "tasks": ["1.6", "1.7", "1.8", "1.9", "5.5"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8"] },
    { "id": 3, "tasks": ["3.9", "3.10", "3.11", "3.12", "5.1", "5.2", "5.3", "5.4"] },
    { "id": 4, "tasks": ["6.1", "6.2", "6.3", "6.6", "6.7"] },
    { "id": 5, "tasks": ["6.4", "6.5"] },
    { "id": 6, "tasks": ["8.1", "8.2", "8.3", "8.4"] },
    { "id": 7, "tasks": ["9.1", "10.1"] },
    { "id": 8, "tasks": ["9.2", "10.2", "10.3"] },
    { "id": 9, "tasks": ["11.1", "11.2", "11.3"] }
  ]
}
```
