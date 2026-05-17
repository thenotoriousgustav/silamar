import * as fs from "fs";

import eslintPluginNext from "@next/eslint-plugin-next";
import eslintPluginCheckFile from "eslint-plugin-check-file";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "typescript-eslint";

const eslintIgnore = [
  ".git/",
  ".next/",
  "node_modules/",
  "dist/",
  "build/",
  "coverage/",
  "*.min.js",
  "*.config.js",
  "*.config.mjs",
  "*.d.ts",
];

const config = typescriptEslint.config(
  {
    ignores: eslintIgnore,
  },
  typescriptEslint.configs.recommended,
  eslintPluginImport.flatConfigs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "@next/next": eslintPluginNext,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginNext.configs.recommended.rules,
      ...eslintPluginNext.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@next/next/no-img-element": "off",
      "import/no-cycle": "error",
      "linebreak-style": ["error", "unix"],

      // Architectural boundary enforcement: feature module isolation
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // Prevent features from importing from each other
            {
              target: "./src/features/cover-letters-list",
              from: "./src/features",
              except: ["./cover-letters-list"],
            },
            {
              target: "./src/features/cover-letter-builder",
              from: "./src/features",
              except: ["./cover-letter-builder"],
            },
            {
              target: "./src/features/job-tracker",
              from: "./src/features",
              except: ["./job-tracker"],
            },
            {
              target: "./src/features/resume-builder",
              from: "./src/features",
              except: ["./resume-builder"],
            },
            {
              target: "./src/features/resumes-list",
              from: "./src/features",
              except: ["./resumes-list"],
            },
            {
              target: "./src/features/resume-analysis",
              from: "./src/features",
              except: ["./resume-analysis"],
            },
            {
              target: "./src/features/billing",
              from: "./src/features",
              except: ["./billing"],
            },
            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
            },
            {
              target: "./src/features/dashboard",
              from: "./src/features",
              except: ["./dashboard"],
            },
            // Prevent features from importing from the app directory
            {
              target: "./src/features",
              from: "./src/app",
            },
            // Prevent core/shared directories from importing from features or app
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/config",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],

      // Strict unused vars — error level
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // No explicit any — enforce strict typing
      "@typescript-eslint/no-explicit-any": "error",

      // Max function length: 30 lines of logic
      "max-lines-per-function": [
        "error",
        {
          max: 30,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],

      // Max nesting depth: 2 levels
      "max-depth": ["error", 2],

      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          pathGroups: [
            ...getDirectoriesToSort().map((singleDir) => ({
              pattern: `${singleDir}/**`,
              group: "internal",
            })),
            {
              pattern: "env",
              group: "internal",
            },
            {
              pattern: "theme",
              group: "internal",
            },
            {
              pattern: "public/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["internal"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // Override max-lines-per-function for .tsx component files (JSX render functions are naturally longer)
  {
    files: ["**/*.tsx"],
    rules: {
      "max-lines-per-function": [
        "warn",
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  // Loading/skeleton files are purely presentational and can be longer
  {
    files: ["**/loading.tsx"],
    rules: {
      "max-lines-per-function": "off",
    },
  },
  // API routes handle complex request/response logic
  {
    files: ["src/app/api/**/*.ts"],
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  // Hooks and service files can be longer due to setup logic
  {
    files: ["src/hooks/**/*.ts", "src/features/*/hooks/**/*.ts", "src/lib/**/*.ts"],
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  // Feature actions and queries have complex business logic
  {
    files: ["src/features/*/actions/**/*.ts", "src/features/*/queries/**/*.ts", "src/features/*/actions.ts", "src/features/*/queries.ts"],
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 80,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  // Feature utility files (completeness calculations, prompts, etc.)
  {
    files: ["src/features/*/utils/**/*.ts", "src/lib/ai/prompts/**/*.ts"],
    rules: {
      "max-lines-per-function": [
        "error",
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  // UI library components (shadcn, data-table, editor) are complex by nature
  {
    files: [
      "src/components/ui/**/*.tsx",
      "src/components/data-table/**/*.tsx",
      "src/components/editor/**/*.tsx",
    ],
    rules: {
      "max-lines-per-function": "off",
      "max-depth": "off",
    },
  },
  // Resume template engine — pagination engines, font registration and the
  // base style sheet are inherently large declarative blocks; per-template
  // PDF/HTML render components also benefit from being read top-to-bottom.
  {
    files: ["src/features/resume-builder/templates/**/*.{ts,tsx}"],
    rules: {
      "max-lines-per-function": "off",
      "max-depth": "off",
    },
  },
  // Disable max-depth for complex UI components that use nested conditionals (kanban, sidebar)
  {
    files: [
      "src/components/layout/**/*.tsx",
      "src/features/*/components/**/*.tsx",
    ],
    rules: {
      "max-depth": ["error", 4],
    },
  },
  // Disable strict react-hooks rules for patterns that are common and intentional
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/use-memo": "off",
    },
  },
  // Prevent component files from importing db/, drizzle-orm, or query files
  {
    files: [
      "src/components/**/*.{ts,tsx}",
      "src/features/*/components/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["db/*", "db", "**/db/**"],
              message:
                "Components must not import from the database layer directly. Use actions or hooks instead.",
            },
            {
              group: ["drizzle-orm", "drizzle-orm/*"],
              message:
                "Components must not import from drizzle-orm. Use actions or hooks instead.",
            },
            {
              group: ["**/queries/**", "**/queries"],
              message:
                "Components must not import query files directly. Use actions or hooks instead.",
            },
          ],
        },
      ],
    },
  },
  // Prevent direct process.env access outside src/config/env.ts
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/config/env.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message:
            "Direct process.env access is not allowed. Import from '@/config/env' instead.",
        },
      ],
    },
  },
  {
    plugins: {
      "check-file": eslintPluginCheckFile,
    },
    files: ["src/**/*"],
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "!(src/app)/**/*": "KEBAB_CASE",
          "!(**/__tests__)/**/*": "KEBAB_CASE",
        },
      ],
    },
  },
);

function getDirectoriesToSort() {
  const ignoredSortingDirectories = [
    ".git",
    ".next",
    ".vscode",
    "node_modules",
  ];
  return fs
    .readdirSync(process.cwd())
    .filter((file) => fs.statSync(process.cwd() + "/" + file).isDirectory())
    .filter((f) => !ignoredSortingDirectories.includes(f));
}

export default config;
