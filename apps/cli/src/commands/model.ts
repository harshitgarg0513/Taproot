import { buildRepositoryModel } from "@eip/core";

export async function model(path: string) {
  const modelResult = await buildRepositoryModel(path);

  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }

  console.log(JSON.stringify(modelResult.data, null, 2));
}
