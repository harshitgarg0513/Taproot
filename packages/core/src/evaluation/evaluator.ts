import type { RepositoryModel } from "../types.js";
import { retrieve } from "../retrieval/index.js";
import { calculate } from "./metrics.js";

export function evaluateCommit(model: RepositoryModel, message: string, actualFiles: string[]) {
  const retrieval = retrieve(model, message);
  const predicted = new Set(retrieval.ranked.map((result) => result.id));

  return calculate(predicted, new Set(actualFiles));
}
