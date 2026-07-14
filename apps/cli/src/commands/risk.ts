import { analyzeRisk, buildRepositoryModel, printRisk } from "@eip/core";

export async function risk(repo: string, target: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const analysis = analyzeRisk(result.data, target);
  printRisk(analysis);
}
