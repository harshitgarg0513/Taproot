import { buildRepositoryModel, retrieve } from "@eip/core";

export async function retrieval(repo: string, query: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const retrievalResult = retrieve(result.data, query);

  console.log();
  console.log("================================");
  console.log("Seed Retrieval");
  console.log("================================");
  console.log();
  console.log("Tokens", retrievalResult.tokens);
  console.log();
  console.table(retrievalResult.ranked);
  console.log();
  console.log("Expanded Nodes", retrievalResult.expanded.size);
}
