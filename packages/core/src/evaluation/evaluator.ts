import path from "node:path";
import type { RepositoryModel } from "../types.js";
import { retrieve } from "../retrieval/index.js";
import { rankContext } from "../context/ranker.js";
import { optimize } from "../context/optimizer.js";
import { applyBudget } from "../context/budget.js";
import { calculate } from "./metrics.js";

function normalizePath(filePath: string, repoRoot: string) {
  const absoluteRepoRoot = path.resolve(repoRoot);
  let normalizedPath = filePath.replace(/\\/g, "/");

  if (normalizedPath.startsWith(absoluteRepoRoot.replace(/\\/g, "/"))) {
    normalizedPath = path.relative(absoluteRepoRoot, normalizedPath).replace(/\\/g, "/");
  }

  normalizedPath = normalizedPath.replace(/^\.\//, "").replace(/^\/+/, "");

  return normalizedPath.toLowerCase();
}

export function evaluateCommit(
  model: RepositoryModel,
  message: string,
  actualFiles: string[],
  repoRoot = ".",
) {
  const retrieval = retrieve(model, message);
  const ranked = rankContext(model, retrieval.ranked);
  const optimized = optimize(ranked);
  const budget = applyBudget(optimized);
  const predicted = new Set(budget.map((item) => normalizePath(item.path, repoRoot)));
  const actual = new Set(actualFiles.map((file) => normalizePath(file, repoRoot)));

  return calculate(predicted, actual);
}
