import { buildRepositoryModel, findComponent, findSymbol } from "@eip/core";

export async function query(repo: string, type: string, value: string) {
  const modelResult = await buildRepositoryModel(repo);

  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }

  const model = modelResult.data;

  switch (type) {
    case "component": {
      const component = findComponent(model, value);
      console.log(component ?? `No component named "${value}" found.`);
      break;
    }

    case "symbol": {
      const symbols = findSymbol(model, value);
      console.log(
        symbols.length > 0 ? symbols : `No symbol named "${value}" found.`,
      );
      break;
    }

    default:
      console.log("Unknown query.");
  }
}
