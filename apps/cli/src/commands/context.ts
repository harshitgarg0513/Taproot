import { buildRepositoryModel, buildContext } from "@eip/core";

export async function context(repo: string, query: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const contextPackage = buildContext(result.data, query);

  console.log();
  console.log("================================");
  console.log("Context Package");
  console.log("================================");
  console.log();
  console.log("Selected Files");
  console.table(contextPackage.budget);
  console.log();
  console.log("Prompt");
  console.log(contextPackage.prompt);
}
