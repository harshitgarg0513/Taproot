import type { RepositoryModel } from "../types.js";

export function expand(model: RepositoryModel, seedIds: Set<string>) {
  const visited = new Set(seedIds);
  const queue = [...seedIds];

  while (queue.length) {
    const current = queue.shift()!;

    for (const edge of model.knowledgeGraph.edges) {
      if (edge.from === current && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }

      if (edge.to === current && !visited.has(edge.from)) {
        visited.add(edge.from);
        queue.push(edge.from);
      }
    }
  }

  return visited;
}
