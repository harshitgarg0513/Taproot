import type { RepositoryModel } from "../types.js";
import { buildDependencySummary } from "./dependencyReasoner.js";
import { inferResponsibility } from "./responsibility.js";

function normalizeTarget(value: string): string {
  return value.trim().replace(/^\.\//, "").replace(/\\/g, "/").toLowerCase();
}

export function explain(model: RepositoryModel, entityName: string) {
  const normalizedTarget = normalizeTarget(entityName);
  const entity = model.classified.find((entry) => {
    const normalizedName = normalizeTarget(entry.entity.name);
    const normalizedFile = normalizeTarget(entry.entity.file);
    return (
      normalizedName === normalizedTarget ||
      normalizedFile === normalizedTarget ||
      normalizedName.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedName)
    );
  });

  if (!entity) {
    return null;
  }

  const dependency = buildDependencySummary(model, entity.entity.file);

  return {
    name: entity.entity.name,
    kind: entity.entity.kind,
    classification: entity.labels,
    responsibility: inferResponsibility(entity),
    dependency,
  };
}
