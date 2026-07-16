import type { RepositoryModel } from "../types.js";
import type { RetrievalResult } from "../retrieval/retrieve.js";

export interface RankedContext {
  id: string;
  path: string;
  score: number;
  reasons: string[];
  snippet?: string;
  startLine?: number;
  endLine?: number;
  ids: string[];
}

export function rankContext(
  _model: RepositoryModel,
  ranked: RetrievalResult[],
): RankedContext[] {
  const aggregated = new Map<string, RankedContext>();

  for (const item of ranked) {
    const existing = aggregated.get(item.path) ?? {
      id: item.path,
      path: item.path,
      score: 0,
      reasons: [],
      ids: [],
    };

    existing.score += item.score;
    existing.reasons = Array.from(new Set([...existing.reasons, ...item.reasons]));
    existing.ids = Array.from(new Set([...existing.ids, ...item.ids]));
    aggregated.set(item.path, existing);
  }

  return Array.from(aggregated.values())
    .map((item) => {
      let score = item.score;
      const fileName = item.path.split("/").pop() ?? item.path;

      if (fileName === "index.ts" || fileName === "barrel.ts") {
        score -= 2;
      }

      return {
        ...item,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);
}
