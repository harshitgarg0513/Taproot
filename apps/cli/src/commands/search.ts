import { buildRepositoryModel, searchRepository } from "@eip/core";

export async function search(repo: string, query: string) {
  const model = await buildRepositoryModel(repo);
  const result = searchRepository(model, query);

  console.log();
  console.log("Search");
  console.log("----------------");
  console.log();
  console.log("Components");
  console.log();

  for (const component of result.components) {
    console.log(component.type.padEnd(15), component.name);
  }

  console.log();
  console.log("Symbols");
  console.log();

  for (const symbol of result.symbols) {
    console.log(symbol.kind.padEnd(15), symbol.name);
  }

  console.log();
  console.log("Files");
  console.log();

  for (const file of result.files) {
    console.log(file);
  }
}
