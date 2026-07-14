import { analyzeRepository } from "@eip/analyzer";

import { RepositoryModel } from "./types.js";

export async function buildRepositoryModel(repo: string): Promise<RepositoryModel> {
  const analysis = await analyzeRepository(repo);

  return {
    components: analysis.components,
    symbols: analysis.symbols,
    relationships: analysis.relationships,
    callGraph: analysis.callGraph,
  };
}
