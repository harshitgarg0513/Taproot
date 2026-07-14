import { buildRepositoryModel, analyzeImpact } from "@eip/core";

export async function impact(repo: string, file: string) {
  const modelResult = await buildRepositoryModel(repo);

  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }

  const result = analyzeImpact(modelResult.data, file);

  if (!result.success) {
    console.error(result.error.message);
    process.exit(1);
  }

  console.log();
  console.log("Impact Analysis");
  console.log("-----------------------");
  console.log();
  console.log("Changed File:");
  console.log(result.data.changedFile);
  console.log();
  console.log("Impacted Files");
  console.log("----------------");
  for (const impactedFile of result.data.impactedFiles) {
    console.log(impactedFile);
  }
  console.log();
  console.log("Impacted Components");
  console.log("----------------");
  for (const component of result.data.impactedComponents) {
    console.log(component);
  }
  console.log();
  console.log("Impacted Symbols");
  console.log("----------------");
  for (const symbol of result.data.impactedSymbols) {
    console.log(symbol);
  }
}
