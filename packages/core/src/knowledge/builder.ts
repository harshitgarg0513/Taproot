import { buildRepositoryModel } from "../builder.js";
import { Result, err, ok } from "@taproot/shared";
import type { KnowledgeGraph } from "../types.js";

export async function buildKnowledge(
  repo: string,
): Promise<Result<KnowledgeGraph>> {
  const modelResult = await buildRepositoryModel(repo);

  if (!modelResult.success) {
    return err(modelResult.error);
  }

  return ok(modelResult.data.knowledgeGraph);
}
