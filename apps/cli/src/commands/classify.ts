import { buildRepositoryModel } from "@taproot/core";

export async function classify(repo: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  for (const entity of result.data.classified) {
    console.log();
    console.log(entity.entity.name);
    console.table(entity.labels);
  }
}
