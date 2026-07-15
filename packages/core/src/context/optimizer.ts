import type { RankedContext } from "./ranker.js";

export function optimize(ranked: RankedContext[]) {
  const seen = new Set<string>();

  return ranked.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}
