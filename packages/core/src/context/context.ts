import { retrieve } from "../retrieval/index.js";
import { rankContext } from "./ranker.js";
import { optimize } from "./optimizer.js";
import { applyBudget } from "./budget.js";
import { buildPrompt } from "./prompt.js";
import { complete } from "./provider.js";
import type { RepositoryModel } from "../types.js";

export async function generate(model: RepositoryModel, query: string) {
  const context = buildContext(model, query);
  const answer = await complete(context.prompt);

  return {
    context,
    answer,
  };
}

export function buildContext(model: RepositoryModel, query: string) {
  const retrieval = retrieve(model, query);

  const fallbackIds = [
    ...model.components.slice(0, 8).map((component) => component.id),
    ...model.symbols.slice(0, 8).map((symbol) => symbol.id),
    ...model.entities.slice(0, 8).map((entity) => entity.id),
  ];

  const seedIds =
    retrieval.expanded.size > 0
      ? retrieval.expanded
      : new Set(
          fallbackIds.length > 0
            ? fallbackIds
            : query
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, " ")
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 8),
        );

  const ranked = rankContext(model, seedIds);
  const optimized = optimize(ranked);
  const budget = applyBudget(optimized);
  const prompt = buildPrompt(query, budget);

  return {
    retrieval,
    budget,
    prompt,
  };
}
