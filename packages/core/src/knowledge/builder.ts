import { buildRepositoryModel } from "../builder.js";
import { buildKnowledgeGraph } from "./graph.js";
import { Result, err, ok } from "@eip/shared";

export async function buildKnowledge(repo: string): Promise<Result<ReturnType<typeof buildKnowledgeGraph>>> {
  const modelResult = await buildRepositoryModel(repo);

  if (!modelResult.success) {
    return err(modelResult.error);
  }

  return ok(buildKnowledgeGraph(modelResult.data));
}
