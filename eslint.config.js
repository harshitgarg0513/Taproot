import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist", "coverage", "node_modules", ".turbo", "apps/vscode/dist"],
  },
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        performance: "readonly",
      },
    },
  },
];
