import crypto from "crypto";
import fs from "fs";
import path from "path";

function walk(dir: string, files: string[]) {
  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === "dist"
    )
      continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
}

export function createCacheKey(repo: string) {
  const files: string[] = [];

  walk(repo, files);

  const hash = crypto.createHash("sha256");

  files.sort();

  for (const file of files) {
    const stat = fs.statSync(file);

    hash.update(file);
    hash.update(stat.mtimeMs.toString());
    hash.update(stat.size.toString());
  }

  return hash.digest("hex");
}
