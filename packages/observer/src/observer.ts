import fs from "fs-extra";
import path from "path";

import { scanRepository } from "./scanner.js";
import { detectProject } from "./detector.js";
import { RepositorySnapshot } from "./types.js";

export async function observeRepository(
  root: string
): Promise<RepositorySnapshot> {
  const start = performance.now();

  const scan = await scanRepository(root);
  const detection = await detectProject(root, scan.extensions);
  const end = performance.now();

  return {
    name: path.basename(root),
    rootPath: root,
    totalFiles: scan.files,
    totalDirectories: scan.directories,
    languages: detection.languages,
    framework: detection.framework,
    packageManager: detection.packageManager,
    hasGit: await fs.pathExists(path.join(root, ".git")),
    scannedAt: new Date(),
    scanDurationMs: Math.round(end - start),
  };
}
