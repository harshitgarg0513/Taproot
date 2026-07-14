import fs from "fs-extra";
import path from "path";

import { defaultConfig } from "./defaults.js";
import { ConfigSchema } from "./schema.js";

export async function loadConfig(repo: string) {
  const file = path.join(repo, "eip.config.json");

  if (!(await fs.pathExists(file))) {
    return defaultConfig;
  }

  const json = await fs.readJson(file);
  return ConfigSchema.parse({
    ...defaultConfig,
    ...json,
  });
}
