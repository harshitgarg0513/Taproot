import fs from "fs-extra";
import path from "path";
import { ScanResult } from "./types.js";

const IGNORE = new Set([
  "node_modules",
  ".git",
  ".turbo",
  "dist",
  "build",
  ".next",
  ".idea",
  ".vscode",
]);

export async function scanRepository(root: string): Promise<ScanResult> {
  const result: ScanResult = {
    files: 0,
    directories: 0,
    extensions: new Set(),
  };

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (IGNORE.has(entry.name)) continue;

      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        result.directories++;
        await walk(full);
      } else {
        result.files++;

        const ext = path.extname(entry.name);

        if (ext) {
          result.extensions.add(ext);
        }
      }
    }
  }

  await walk(root);

  return result;
}
