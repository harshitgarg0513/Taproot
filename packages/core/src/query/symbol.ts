import { RepositoryModel } from "../types.js";

export function findSymbol(model: RepositoryModel, name: string) {
  return model.symbols.filter((s) => s.name === name);
}
