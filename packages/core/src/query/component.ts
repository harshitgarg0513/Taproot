import { RepositoryModel } from "../types.js";

export function findComponent(model: RepositoryModel, name: string) {
  const normalized = name.toLowerCase();

  for (const component of model.components) {
    if (component.name.toLowerCase() === normalized) {
      return component;
    }
  }

  return undefined;
}

export function listComponents(model: RepositoryModel) {
  return [...model.components];
}
