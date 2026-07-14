import { EipConfig } from "./types.js";

export const defaultConfig: EipConfig = {
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
