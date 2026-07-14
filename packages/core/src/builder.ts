import { analyzeRepository } from "@eip/analyzer";

import { RepositoryModel } from "./types.js";
import { Result, err, ok } from "@eip/shared";
import { createCacheKey, getCachedModel, setCachedModel } from "./cache/index.js";

export async function buildRepositoryModel(repo: string): Promise<Result<RepositoryModel>> {
  const key = createCacheKey(repo);
  const cached = getCachedModel(key);

  if (cached) {
    return ok(cached);
  }

  const analysisResult = await analyzeRepository(repo);

  if (!analysisResult.success) {
    return err(analysisResult.error);
  }

  const analysis = analysisResult.data;
  const model = {
    components: analysis.components,
    symbols: analysis.symbols,
    relationships: analysis.relationships,
    callGraph: analysis.callGraph,
  };

  setCachedModel(key, model);

  return ok(model);
}
