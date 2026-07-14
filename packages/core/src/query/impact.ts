import { RepositoryModel } from "../types.js";

export function impactedFiles(model: RepositoryModel, file: string) {
  const visited = new Set<string>();

  function dfs(current: string) {
    if (visited.has(current)) return;

    visited.add(current);

    const next = model.relationships.filter((r) => r.from === current);

    for (const edge of next) {
      dfs(edge.to);
    }
  }

  dfs(file);

  return [...visited];
}
