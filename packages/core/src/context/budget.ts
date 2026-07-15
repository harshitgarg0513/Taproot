import type { RankedContext } from "./ranker.js";

export function applyBudget(items: RankedContext[], maxItems = 20) {
  return items.slice(0, maxItems);
}
