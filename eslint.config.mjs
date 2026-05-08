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
            // Prevent features from importing from the app directory
            {
              target: "./src/features",
              from: "./src/app",
            },
            // Prevent core directories from importing from features or app
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      "import/order": [
        "warn",
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
