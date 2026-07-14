import { RepositoryModel } from "../types.js";

export function dependenciesOf(model: RepositoryModel, file: string) {
  return model.relationships.filter((r) => r.from === file);
}

export function dependentsOf(model: RepositoryModel, file: string) {
  return model.relationships.filter((r) => r.to === file);
}
