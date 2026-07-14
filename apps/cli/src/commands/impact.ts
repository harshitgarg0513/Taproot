import { buildRepositoryModel, analyzeImpact } from "@eip/core";

export async function impact(repo: string, file: string) {
  const model = await buildRepositoryModel(repo);
  const result = analyzeImpact(model, file);

  console.log();
  console.log("Impact Analysis");
  console.log("-----------------------");
  console.log();
  console.log("Changed File:");
  console.log(result.changedFile);
  console.log();
  console.log("Impacted Files");
  console.log("----------------");
  for (const impactedFile of result.impactedFiles) {
    console.log(impactedFile);
  }
  console.log();
  console.log("Impacted Components");
  console.log("----------------");
  for (const component of result.impactedComponents) {
    console.log(component);
  }
  console.log();
  console.log("Impacted Symbols");
  console.log("----------------");
  for (const symbol of result.impactedSymbols) {
    console.log(symbol);
  }
}
