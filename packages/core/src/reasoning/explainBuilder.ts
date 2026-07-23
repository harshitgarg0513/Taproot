import type { RepositoryModel } from "../types.js";
import { matches } from "@taproot/shared";
import { buildDependencySummary } from "./dependencyReasoner.js";
import { inferResponsibility } from "./responsibility.js";

export interface ExplainComponentResult {
  component: string;
  file: string;
  kind: string;
  source: "component" | "symbol";
}

export function explainComponent(model: RepositoryModel, query: string): ExplainComponentResult | null {
  const component = model.components.find((candidate) => {
    return matches(query, candidate.name) || matches(query, candidate.file);
  });

  if (component) {
    return {
      component: component.name,
      file: component.file,
      kind: component.type,
      source: "component",
    };
  }

  const symbol = model.symbols.find((candidate) => {
    return matches(query, candidate.name) || matches(query, candidate.file);
  });

  if (symbol) {
    return {
      component: symbol.name,
      file: symbol.file,
      kind: symbol.kind,
      source: "symbol",
    };
  }

  return null;
}

export function explain(model: RepositoryModel, entityName: string) {
  const entity = model.classified.find((entry) => {
    return matches(entityName, entry.entity.name) || matches(entityName, entry.entity.file);
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
