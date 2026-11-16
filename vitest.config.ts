import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    passWithNoTests: true,
    include: [
      "src/**/*.{test,spec,property}.{ts,tsx}",
      "db/**/*.{test,spec,property}.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts", "db/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts", "**/*.property.ts"],
    },
  },
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src/"),
      "@/db": path.resolve(__dirname, "./db/index.ts"),
      "@/server": path.resolve(__dirname, "./server"),
    },
  },
});
