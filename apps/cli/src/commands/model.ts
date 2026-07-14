import { buildRepositoryModel } from "@eip/core";

export async function model(path: string) {
  const model = await buildRepositoryModel(path);
  console.log(JSON.stringify(model, null, 2));
}
