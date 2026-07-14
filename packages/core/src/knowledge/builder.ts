import { buildRepositoryModel } from "../builder.js";
import { buildKnowledgeGraph } from "./graph.js";

export async function buildKnowledge(repo: string) {
  const model = await buildRepositoryModel(repo);

  return buildKnowledgeGraph(model);
}
