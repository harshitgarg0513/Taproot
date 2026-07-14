import fs from "fs-extra";
import path from "path";

import { scanRepository } from "./scanner.js";
import { detectProject } from "./detector.js";
import { RepositorySnapshot } from "./types.js";
import { RepositoryNotFoundError, Result, err, ok } from "@eip/shared";

export async function observeRepository(root: string): Promise<Result<RepositorySnapshot>> {
  const start = performance.now();

  if (!(await fs.pathExists(root))) {
    return err(new RepositoryNotFoundError(root));
  }

  const scan = await scanRepository(root);
  const detection = await detectProject(root, scan.extensions);
  const end = performance.now();

  return ok({
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
  });
}
