# Requirements Document

## Introduction

This document defines the requirements for a comprehensive enterprise-grade refactoring of the SiLamar application — a Next.js 16 resume/job application management platform. The refactoring aims to enforce Clean Architecture, modular design, strict type safety, performance optimization, and maintainability across the entire codebase. The goal is to eliminate technical debt, remove dead code, decouple business logic from UI, and align the project with SOLID principles and Next.js 16 best practices.

## Glossary

- **Application**: The SiLamar Next.js web application
- **Feature_Module**: A self-contained directory under `src/features/` encapsulating domain logic, components, hooks, types, actions, and queries for a single business capability
- **Service_Layer**: A set of pure functions or classes in `src/lib/` that encapsulate business logic independent of UI framework concerns
- **Server_Component**: A React component that renders on the server, enabling direct data access without client-side JavaScript overhead
- **Client_Component**: A React component marked with `"use client"` that runs in the browser and handles interactivity
- **Server_Action**: A function marked with `"use server"` that executes on the server and can be called from client components
- **Data_Transfer_Object (DTO)**: A typed object that carries data between layers without exposing internal database schema details
- **Repository_Pattern**: An abstraction layer between the database schema and business logic that provides typed query methods
- **Validation_Schema**: A Zod schema that defines the shape and constraints of data at system boundaries (API inputs, form submissions, environment variables)
- **Barrel_Export**: An `index.ts` file that re-exports public API from a module, controlling what is accessible externally
- **Dead_Code**: Unreachable code, unused imports, unused variables, or unused exports that serve no functional purpose
- **Guard_Clause**: An early return pattern that handles edge cases at the top of a function to reduce nesting

## Requirements

### Requirement 1: Feature-Based Modular Architecture

**User Story:** As a developer, I want the codebase organized into self-contained feature modules, so that I can work on a feature without understanding the entire application.

#### Acceptance Criteria

1. THE Application SHALL organize all domain-specific code into Feature_Modules under `src/features/{feature-name}/`
2. WHEN a Feature_Module is created, THE Application SHALL include a sub-structure consisting of any combination of the following directories: `components/`, `hooks/`, `actions/`, `queries/`, `types/`, and `utils/`, where at least one directory or one top-level file (e.g., `actions.ts`, `queries.ts`) exists within the module
3. THE Application SHALL enforce that Feature_Modules do not import from other Feature_Modules via ESLint `import/no-restricted-paths` rules configured at severity level "error", causing lint failure on violation
4. THE Application SHALL enforce that Feature_Modules do not import from `src/app/` via ESLint `import/no-restricted-paths` rules configured at severity level "error", causing lint failure on violation
5. THE Application SHALL expose each Feature_Module's public API through a Barrel_Export (`index.ts`) at the module root
6. WHEN shared logic is needed across features, THE Application SHALL place it in `src/lib/` (services and utilities), `src/components/shared/` (shared UI components), `src/hooks/` (shared hooks), `src/types/` (shared type definitions), or `src/config/` (shared configuration)
7. THE Application SHALL enforce that shared directories (`src/components/`, `src/hooks/`, `src/lib/`, `src/types/`) do not import from `src/features/` or `src/app/` via ESLint `import/no-restricted-paths` rules configured at severity level "error"

### Requirement 2: Clean Architecture Separation of Concerns

**User Story:** As a developer, I want business logic separated from UI components and data access, so that I can test and modify each layer independently.

#### Acceptance Criteria

1. THE Application SHALL separate code into three layers: Presentation (`src/components/`, `src/features/*/components/`), Application (`src/features/*/actions/`, `src/features/*/hooks/`, `src/lib/` services), and Infrastructure (`src/features/*/queries/`, `db/`, external API clients in `src/lib/`)
2. THE Application SHALL enforce a unidirectional dependency rule: Presentation MAY import from Application, Application MAY import from Infrastructure, but Infrastructure SHALL NOT import from Presentation, and Presentation SHALL NOT import directly from Infrastructure
3. THE Service_Layer SHALL contain functions that accept typed inputs and return typed outputs without importing from `react`, `next/headers`, `next/cache`, `next/navigation`, or any `db/` module
4. WHEN a Server_Action contains data transformation, validation beyond schema parsing, conditional branching on domain rules, or computation involving more than one entity, THE Server_Action SHALL delegate that logic to a Service_Layer function rather than implementing it inline
5. THE Application SHALL ensure that files in `src/components/` and `src/features/*/components/` contain no imports from `db/`, `drizzle-orm`, or `src/features/*/queries/` and contain no functions that perform multi-step data transformation or domain rule evaluation
6. WHEN data is returned from Infrastructure (queries) to Application (actions, hooks) or from Application to Presentation (components), THE Application SHALL map database row types to Data_Transfer_Objects that expose only the fields required by the consuming layer
7. IF a Presentation component needs data, THEN THE component SHALL receive it via props or React context provided by a parent Server_Component rather than invoking database queries or Server_Actions that return raw database row types

### Requirement 3: Strict TypeScript Implementation

**User Story:** As a developer, I want strict TypeScript enforcement across the codebase, so that type errors are caught at compile time rather than runtime.

#### Acceptance Criteria

1. THE Application SHALL enable `strict: true` in `tsconfig.json` including `noImplicitAny`, `strictNullChecks`, and `strictFunctionTypes`
2. THE Application SHALL contain zero instances of the `any` type in production source code, where production source code is defined as all `.ts` and `.tsx` files under `src/`, `db/`, and `server/`, excluding files in `.next/`, `node_modules/`, and files ending in `.d.ts` from third-party packages
3. WHEN an API response is received from an external service or third-party API, THE Application SHALL validate it against a Validation_Schema before passing the data to any component or business logic function
4. IF validation of an external API response fails against its Validation_Schema, THEN THE Application SHALL discard the invalid response and return a typed error result to the caller without propagating unvalidated data
5. WHEN a Server_Action receives input, THE Server_Action SHALL validate the input against a Validation_Schema as the first operation, and IF validation fails, THEN THE Server_Action SHALL return a typed error response containing a description of the validation failure without processing the input further
6. THE Application SHALL define shared domain types in `src/features/*/types/` for feature-specific types and `src/types/` for cross-cutting types
7. THE Application SHALL use discriminated unions with a literal `status` field (values: `"idle"`, `"loading"`, `"error"`, `"success"`) for all custom async operation state types that are managed outside of React Query, rather than using optional fields or boolean flags to represent state

### Requirement 4: Server Component and Data Fetching Optimization

**User Story:** As a developer, I want optimal use of Server Components and efficient data fetching, so that the application delivers fast page loads and minimal client-side JavaScript.

#### Acceptance Criteria

1. THE Application SHALL use Server_Components as the default for all pages and layouts that do not require client-side interactivity (event handlers, browser APIs, or hooks with state)
2. WHEN a component requires interactivity (event handlers, browser APIs, hooks with state), THE Application SHALL mark it with `"use client"` and ensure it does not wrap Server_Components as children in the component tree
3. THE Application SHALL colocate data fetching in Server_Components at the page or layout level using async functions, passing data down as props to Client_Components
4. WHEN multiple independent data fetches are needed on a page, THE Application SHALL execute them in parallel using `Promise.all` or equivalent concurrent patterns rather than sequential awaits
5. THE Application SHALL use React `cache()` to deduplicate data fetches that call the same function with the same arguments within a single server request
6. WHEN data is fetched for lists or collections, THE Application SHALL implement pagination or cursor-based fetching with a maximum page size of 50 records per request rather than loading all records at once
7. IF a server-side data fetch returns no data for a required resource, THEN THE Application SHALL invoke the Next.js `notFound()` function to render the appropriate not-found boundary

### Requirement 5: Dead Code Elimination and Code Hygiene

**User Story:** As a developer, I want all dead code removed from the codebase, so that I can navigate and understand the code without confusion from unused artifacts.

#### Acceptance Criteria

1. THE Application SHALL contain zero unused imports across all TypeScript and TSX source files under `src/` and `db/`, as reported by the ESLint `no-unused-vars` and `unused-imports` rules
2. THE Application SHALL contain zero unused variables or function parameters (except those prefixed with `_` or required by framework interface contracts such as Next.js route handler signatures)
3. THE Application SHALL contain zero unreachable code paths or commented-out code blocks, where a commented-out code block is defined as two or more consecutive commented lines that contain syntactically valid TypeScript or JSX statements (excluding JSDoc comments, TODO annotations, and explanatory prose comments)
4. THE Application SHALL contain zero unused exported functions or components that have no import references within the codebase, excluding Next.js framework-consumed exports (default page/layout/route exports, `generateMetadata`, `metadata`, `revalidate`, and `dynamic` config exports)
5. WHEN a file contains only Dead_Code, THE Application SHALL delete the file entirely
6. THE Application SHALL remove the `src/app/api/debug-db/` route and any other routes whose sole purpose is inspecting internal application state for debugging (identified by route path containing "debug", "test", or "dev-only" segments, or by the absence of authentication guards on data-inspection endpoints)

### Requirement 6: SOLID Principles and DRY Patterns

**User Story:** As a developer, I want the codebase to follow SOLID principles and eliminate repetition, so that changes are localized and code is reusable.

#### Acceptance Criteria

1. THE Application SHALL ensure each function performs a single operation and each component renders a single conceptual UI section, such that modifying one behavior requires changes to only one function or component
2. WHEN a block of logic consisting of 3 or more statements appears in more than two locations, THE Application SHALL extract it into a reusable utility function, custom hook, or shared component
3. THE Application SHALL ensure authentication session retrieval is handled by a single reusable function (`getSessionUser`) located in `src/lib/` and imported by all feature modules, rather than each feature defining its own session retrieval logic
4. THE Application SHALL use composition over inheritance for component reuse, leveraging React's `children` prop, render props, or compound component patterns
5. WHEN a component accepts more than five props, THE Application SHALL decompose it into smaller components each accepting no more than five props, unless all props belong to a single cohesive data object
6. THE Application SHALL use dependency injection patterns (function parameters, React context) rather than hard-coded imports for external service clients (AI API, payment gateway, file storage) to enable substitution during testing

### Requirement 7: Code Readability and Maintainability

**User Story:** As a developer, I want the code to be self-documenting and easy to read, so that new team members can onboard quickly and existing developers can maintain it efficiently.

#### Acceptance Criteria

1. THE Application SHALL use variable and function names that contain at least two words describing the domain concept and action (e.g., `fetchResumeById` instead of `getData`, `isSubscriptionActive` instead of `flag`)
2. WHEN a function contains nested conditionals deeper than two levels (measured by indentation depth from the function body), THE Application SHALL refactor using Guard Clauses or early returns to flatten the logic to a maximum nesting depth of two levels
3. THE Application SHALL limit function body length to 30 lines of logic (excluding blank lines, comments, type definitions, and import statements), extracting sub-operations into named helper functions
4. THE Application SHALL use consistent naming conventions: kebab-case for files and folders, PascalCase for components and types, camelCase for functions and variables — enforced by the `eslint-plugin-check-file` rule
5. WHEN a function implements logic that involves more than three conditional branches or a non-obvious transformation (e.g., coordinate mapping, scoring algorithm, state machine transition), THE Application SHALL include a JSDoc comment explaining the business rationale or design decision behind the approach
6. THE Application SHALL organize imports in a consistent order: built-in modules, external packages, internal aliases, relative imports — with newlines separating each group, enforced by the ESLint `import/order` rule
7. IF a function accepts more than 3 parameters, THEN THE Application SHALL use a single configuration object parameter with named properties to preserve readability

### Requirement 8: API Route and Server Action Standardization

**User Story:** As a developer, I want consistent patterns for API routes and server actions, so that error handling and response formats are predictable across the application.

#### Acceptance Criteria

1. THE Application SHALL define a standard response type for all Server_Actions: `{ success: true, data: T } | { success: false, error: string }` where the `error` field contains a human-readable description of the failure reason without exposing internal system details
2. WHEN a Server_Action encounters a runtime error, a validation failure, or an authorization failure, THE Server_Action SHALL return a typed error response with `{ success: false, error: string }` rather than throwing an unhandled exception
3. WHEN an API route receives a request body that fails Validation_Schema parsing, THE API route SHALL return a 400 status response with a body describing which fields failed validation, without processing the request further
4. IF a request to a protected Server_Action or API route lacks a valid authenticated session, THEN THE Application SHALL return an unauthorized error response immediately using the shared `getSessionUser` utility before executing any business logic
5. WHEN a Server_Action mutates data, THE Server_Action SHALL call `revalidatePath` or `revalidateTag` for each route that displays the mutated resource to maintain cache consistency
6. THE Application SHALL organize API routes by domain: `src/app/api/{domain}/{action}/route.ts`
7. WHEN an API route returns a successful response, THE API route SHALL use the JSON structure `{ success: true, ...data }` with a 200 status code to maintain consistency with the Server_Action response pattern

### Requirement 9: Environment and Configuration Management

**User Story:** As a developer, I want environment variables and application configuration validated at startup, so that misconfigurations are caught immediately rather than causing runtime failures.

#### Acceptance Criteria

1. THE Application SHALL validate all required environment variables at application startup (both development server start and production build) using a Zod schema defined in `src/config/env.ts`
2. IF a required environment variable is missing, THEN THE Application SHALL terminate the startup process and output an error message that identifies each missing variable by name
3. IF a required environment variable is present but fails Zod schema validation (e.g., invalid URL format, incorrect type), THEN THE Application SHALL terminate the startup process and output an error message that identifies the variable name and the validation rule that failed
4. THE Application SHALL centralize all application constants and configuration in `src/config/` with typed exports
5. THE Application SHALL use a single `src/config/env.ts` module as the sole access point for environment variables, rather than accessing `process.env` directly throughout the codebase

### Requirement 10: Performance and Bundle Optimization

**User Story:** As a developer, I want the application optimized for production performance, so that users experience fast load times and smooth interactions.

#### Acceptance Criteria

1. THE Application SHALL use dynamic imports (`next/dynamic`) for client-side components whose library dependencies exceed 50KB gzipped (PDF renderer via `@react-pdf/renderer`, rich text editor via `lexical`, charts) that are not needed on initial page load
2. WHEN a Client_Component imports a library exceeding 50KB gzipped, THE Application SHALL lazy-load it using `next/dynamic` or dynamic `import()` to exclude it from the initial JavaScript bundle
3. THE Application SHALL configure Next.js image optimization for all user-facing images using the `next/image` component with explicit `width` and `height` or `fill` properties to prevent layout shift
4. THE Application SHALL implement loading states using React Suspense boundaries at each async data-fetching boundary (page-level data loads, lazy-loaded components) displaying a skeleton or spinner placeholder until content resolves
5. THE Application SHALL use column-specific `select()` clauses in all Drizzle ORM queries, fetching only the columns required by the consuming component or action rather than entire rows
6. THE Application SHALL configure Next.js caching strategies (`unstable_cache`, `revalidateTag`) for data that changes less frequently than once per user session, with a minimum revalidation interval of 60 seconds
7. WHEN a dynamically imported component is loading, THE Application SHALL render a non-empty placeholder (skeleton or spinner) with dimensions matching the expected component layout to prevent cumulative layout shift

### Requirement 11: Error Handling and Resilience

**User Story:** As a developer, I want consistent error handling throughout the application, so that failures are graceful, informative, and do not crash the user experience.

#### Acceptance Criteria

1. THE Application SHALL implement Next.js `error.tsx` boundary files for each route group to catch runtime errors and display a non-technical error message with a retry action and a link to navigate back to the dashboard
2. THE Application SHALL implement `not-found.tsx` pages for each route group to handle 404 scenarios with a link to the dashboard and a link to navigate to the previous page
3. WHEN an external service call fails with a server error (5xx) or network timeout (AI API, payment gateway, file upload), THE Application SHALL retry with exponential backoff starting at 1 second (doubling each attempt, maximum 8 seconds delay) up to three attempts before returning a typed error response conforming to the standard Server_Action response format
4. IF an external service call fails with a client error (4xx) or authentication error, THEN THE Application SHALL return a typed error response immediately without retrying
5. THE Application SHALL log errors with structured context (user ID, action name, input summary truncated to 200 characters) for debugging, excluding passwords, authentication tokens, payment card numbers, and full API keys from all log output
6. IF a database operation fails, THEN THE Application SHALL return a generic error message indicating the operation could not be completed, without exposing table names, column names, SQL statements, or connection strings

### Requirement 12: Next.js 16 Best Practices Alignment

**User Story:** As a developer, I want the application to leverage Next.js 16 features and conventions, so that the codebase stays current and benefits from framework optimizations.

#### Acceptance Criteria

1. THE Application SHALL use the App Router exclusively with route groups for logical separation, shared layouts for each route group, and `loading.tsx` and `error.tsx` boundary files for every route segment that performs asynchronous data fetching
2. THE Application SHALL use the async `params` and `searchParams` pattern (typed as `Promise`) for all dynamic route pages and awaited before access, as required by Next.js 16
3. THE Application SHALL use `next.config.ts` (TypeScript) for configuration with the exported object typed as `NextConfig` from the `next` package
4. THE Application SHALL use Server Actions (files marked with `"use server"`) for all data mutations except where the operation requires streaming responses, handles external webhook callbacks, or processes file uploads via multipart requests — those operations SHALL use Route Handlers (API routes)
5. WHEN a page or layout defines user-visible page titles or SEO-relevant information, THE Application SHALL use the static `metadata` export for fixed values or the `generateMetadata` async function for dynamic values, following Next.js 16 Metadata API conventions
6. THE Application SHALL remove the `export const dynamic = "force-dynamic"` directive from any route segment where the framework can automatically detect dynamic rendering (e.g., usage of `cookies()`, `headers()`, or uncached `fetch`), retaining it only in route segments where no dynamic API is called yet dynamic behavior is still required
