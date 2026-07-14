import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      include: [
        "packages/core/src/**/*.ts",
        "packages/observer/src/**/*.ts",
        "packages/analyzer/src/**/*.ts",
        "packages/shared/src/**/*.ts",
      ],
      exclude: ["**/*.d.ts", "**/dist/**", "**/tests/**", "**/node_modules/**"],
      thresholds: {
        statements: 80,
        functions: 80,
        lines: 80,
        branches: 70,
      },
    },
  },
});
