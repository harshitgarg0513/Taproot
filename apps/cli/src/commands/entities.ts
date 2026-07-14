import { buildRepositoryModel } from "@eip/core";

export async function entities(repo: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  console.table(result.data.entities);
}
