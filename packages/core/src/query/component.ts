import { RepositoryModel } from "../types.js";

export function findComponent(model: RepositoryModel, name: string) {
  return model.components.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function listComponents(model: RepositoryModel) {
  return [...model.components];
}
