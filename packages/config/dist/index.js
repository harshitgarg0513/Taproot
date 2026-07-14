// src/loader.ts
import fs from "fs-extra";
import path from "path";

// src/defaults.ts
var defaultConfig = {
  ignore: ["node_modules", ".git", "dist", "coverage", ".next", ".turbo"],
  languages: ["typescript"],
  cache: true,
  cacheTTL: 300,
  followSymlinks: false,
  output: {
    colors: true,
    format: "table"
  }
};

// src/schema.ts
import { z } from "zod";
var ConfigSchema = z.object({
  ignore: z.array(z.string()),
  languages: z.array(z.string()),
  cache: z.boolean(),
  cacheTTL: z.number(),
  followSymlinks: z.boolean(),
  output: z.object({
    colors: z.boolean(),
    format: z.enum(["table", "json"])
  })
});

// src/loader.ts
async function loadConfig(repo) {
  const file = path.join(repo, "eip.config.json");
  if (!await fs.pathExists(file)) {
    return defaultConfig;
  }
  const json = await fs.readJson(file);
  return ConfigSchema.parse({
    ...defaultConfig,
    ...json
  });
}
export {
  defaultConfig,
  loadConfig
};
