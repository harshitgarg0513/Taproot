import { buildRepositoryModel, explain, printExplain } from "@eip/core";

export async function explainCommand(repo: string, entity: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const explanation = explain(result.data, entity);

  if (!explanation) {
    console.log("Entity not found.");
    return;
  }

  printExplain(explanation);
}
