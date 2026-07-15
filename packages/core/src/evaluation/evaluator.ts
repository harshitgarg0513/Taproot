import path from "node:path";
import type { RepositoryModel } from "../types.js";
import { retrieve } from "../retrieval/index.js";
import { calculate } from "./metrics.js";

function normalizePath(filePath: string, repoRoot: string) {
  const absoluteRepoRoot = path.resolve(repoRoot);
  const normalizedPath = filePath.replace(/\\/g, "/");

  if (normalizedPath.startsWith(absoluteRepoRoot.replace(/\\/g, "/"))) {
    return path.relative(absoluteRepoRoot, normalizedPath).replace(/\\/g, "/");
  }

  return normalizedPath.replace(/^\.\//, "");
}

export function evaluateCommit(
  model: RepositoryModel,
  message: string,
  actualFiles: string[],
  repoRoot = ".",
) {
  const retrieval = retrieve(model, message);
  const predicted = new Set(
    retrieval.ranked.map((result) => normalizePath(result.path, repoRoot)),
  );
  const actual = new Set(actualFiles.map((file) => normalizePath(file, repoRoot)));

  return calculate(predicted, actual);
}
