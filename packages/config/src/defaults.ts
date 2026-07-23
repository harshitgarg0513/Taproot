import { TaprootConfig } from "./types.js";

export const defaultConfig: TaprootConfig = {
  ignore: ["node_modules", ".git", "dist", "coverage", ".next", ".turbo"],
  languages: ["typescript"],
  cache: true,
  cacheTTL: 300,
  followSymlinks: false,
  output: {
    colors: true,
    format: "table",
  },
};
