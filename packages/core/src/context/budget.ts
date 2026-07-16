import type { RankedContext } from "./ranker.js";

export function applyBudget(items: RankedContext[], maxItems = 8, maxTokens = 7000) {
  let usedTokens = 0;
  const selected: RankedContext[] = [];

  for (const item of items) {
    if (selected.length >= maxItems) {
      break;
    }

    const estimatedTokens = Math.ceil((item.path.length + (item.score.toString().length + item.reasons.join(" ").length)) / 4);

    if (selected.length > 0 && usedTokens + estimatedTokens > maxTokens) {
      break;
    }

    usedTokens += estimatedTokens;
    selected.push(item);
  }

  return selected;
}
