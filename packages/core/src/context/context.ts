import { retrieve } from "../retrieval/index.js";
import { rankContext } from "./ranker.js";
import { optimize } from "./optimizer.js";
import { applyBudget } from "./budget.js";
import { buildPrompt } from "./prompt.js";
import { complete } from "./provider.js";
import type { RepositoryModel } from "../types.js";

type ContextBuildResult =
  | {
      success: true;
      retrieval: ReturnType<typeof retrieve>;
      confidence: ReturnType<typeof retrieve>["confidence"];
      budget: Array<{ id: string; path: string; score: number; reasons: string[] }>;
      prompt: string;
    }
  | {
      success: false;
      confidence: ReturnType<typeof retrieve>["confidence"];
      message: string;
    };

export async function generate(model: RepositoryModel, query: string) {
  const context = await buildContext(model, query);

  if (!context.success) {
    return {
      context,
      answer: "",
      generation: undefined,
    };
  }

  const generation = await complete(context.prompt);

  return {
    context,
    answer: generation.text,
    generation,
  };
}

export async function buildContext(model: RepositoryModel, query: string): Promise<ContextBuildResult> {
  const retrieval = retrieve(model, query);

  if (retrieval.confidence.level === "LOW") {
    return {
      success: false,
      confidence: retrieval.confidence,
      message: "Unable to identify reliable repository context.",
    };
  }

  const seedIds = retrieval.expanded.size > 0 ? retrieval.expanded : new Set<string>();
  const ranked = rankContext(model, seedIds);
  const optimized = optimize(ranked);
  const budget = applyBudget(optimized);
  const prompt = await buildPrompt(
    query,
    budget.map((item) => item.path),
  );

  return {
    success: true,
    retrieval,
    confidence: retrieval.confidence,
    budget,
    prompt,
  };
}
