import type { RepositoryModel } from "../types.js";

export interface RankedContext {
  id: string;
  score: number;
  reasons: string[];
}

export function rankContext(
  model: RepositoryModel,
  expanded: Set<string>,
): RankedContext[] {
  const ranked: RankedContext[] = [];

  for (const id of expanded) {
    let score = 0;
    const reasons: string[] = [];

    const degree = model.knowledgeGraph.edges.filter(
      (edge) => edge.from === id || edge.to === id,
    ).length;

    score += degree;
    reasons.push(`graph-degree:${degree}`);

    const component =
      model.componentIndex.get(id) ??
      model.components.find((candidate) => candidate.id === id);
    const symbol =
      model.symbolIndex.get(id) ??
      model.symbols.find((candidate) => candidate.id === id);
    const displayId = component?.name ?? symbol?.name ?? id;

    ranked.push({
      id: displayId,
      score,
      reasons,
    });
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}
