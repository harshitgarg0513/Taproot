import { analyzeRepository } from "@eip/analyzer";

import { RepositoryModel } from "./types.js";
import { Result, err, ok } from "@eip/shared";

export async function buildRepositoryModel(repo: string): Promise<Result<RepositoryModel>> {
  const analysisResult = await analyzeRepository(repo);

  if (!analysisResult.success) {
    return err(analysisResult.error);
  }

  const analysis = analysisResult.data;

  return ok({
    components: analysis.components,
    symbols: analysis.symbols,
    relationships: analysis.relationships,
    callGraph: analysis.callGraph,
  });
}
