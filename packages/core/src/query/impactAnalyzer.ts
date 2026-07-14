import { RepositoryModel } from "../types.js";
import { Result, ok } from "@eip/shared";

export interface ImpactResult {
  changedFile: string;
  impactedFiles: string[];
  impactedComponents: string[];
  impactedSymbols: string[];
}

export function analyzeImpact(
  model: RepositoryModel,
  changedFile: string,
): Result<ImpactResult> {
  const impactedFiles = new Set<string>();
  const impactedComponents = new Set<string>();
  const impactedSymbols = new Set<string>();

  function dfs(file: string) {
    if (impactedFiles.has(file)) return;

    impactedFiles.add(file);

    for (const edge of model.relationships) {
      if (edge.to === file) {
        dfs(edge.from);
      }
    }
  }

  dfs(changedFile);

  for (const symbol of model.symbols) {
    if (impactedFiles.has(symbol.file)) {
      impactedSymbols.add(symbol.name);
    }
  }

  for (const component of model.components) {
    if (impactedFiles.has(component.file)) {
      impactedComponents.add(component.name);
    }
  }

  return ok({
    changedFile,
    impactedFiles: [...impactedFiles],
    impactedComponents: [...impactedComponents],
    impactedSymbols: [...impactedSymbols],
  });
}
