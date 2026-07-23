import { buildRepositoryModel, searchRepository } from "@taproot/core";

export async function search(repo: string, query: string) {
  const modelResult = await buildRepositoryModel(repo);

  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }

  const result = searchRepository(modelResult.data, query);

  if (!result.success) {
    console.error(result.error.message);
    process.exit(1);
  }

  console.log();
  console.log("Search");
  console.log("----------------");
  console.log();
  console.log("Components");
  console.log();

  for (const component of result.data.components) {
    console.log(component.type.padEnd(15), component.name);
  }

  console.log();
  console.log("Symbols");
  console.log();

  for (const symbol of result.data.symbols) {
    console.log(symbol.kind.padEnd(15), symbol.name);
  }

  console.log();
  console.log("Files");
  console.log();

  for (const file of result.data.files) {
    console.log(file);
  }
}
