import type { RankedContext } from "./ranker.js";

export function optimize(ranked: RankedContext[]) {
  const byPath = new Map<string, RankedContext>();

  for (const item of ranked) {
    const previous = byPath.get(item.path);

    if (!previous || item.score > previous.score) {
      byPath.set(item.path, item);
    }
  }

  return Array.from(byPath.values()).sort((a, b) => b.score - a.score);
}
