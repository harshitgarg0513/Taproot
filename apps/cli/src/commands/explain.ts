import { buildRepositoryModel, explainComponent, formatExplain } from "@eip/core";

export async function explain(repo: string, target: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const explanation = explainComponent(result.data, target);

  if (!explanation) {
    console.log("Component not found.");
    return;
  }

  formatExplain(explanation);
}
