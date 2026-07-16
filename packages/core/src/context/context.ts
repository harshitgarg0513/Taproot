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
      budget: Array<{ id: string; path: string; score: number; reasons: string[]; ids: string[] }>;
      prompt: string;
      promptTokens: number;
    }
  | {
      success: false;
      confidence: ReturnType<typeof retrieve>["confidence"];
      message: string;
    };

export async function generate(model: RepositoryModel, query: string, repo = process.cwd()) {
  const context = await buildContext(model, query, repo);

  if (!context.success) {
    return {
      context,
      answer: "",
      generation: undefined,
    };
  }

  try {
    const generation = await complete(context.prompt);

    return {
      context,
      answer: generation.text,
      generation,
    };
  } catch (error) {
    return {
      context,
      answer: "",
      generation: undefined,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export async function buildContext(
  model: RepositoryModel,
  query: string,
  repo = process.cwd(),
): Promise<ContextBuildResult> {
  const retrieval = retrieve(model, query);

  if (retrieval.ranked.length === 0 || retrieval.confidence.level === "LOW") {
    return {
      success: false,
      confidence: retrieval.confidence,
      message: "No repository vocabulary matched. Try component names, feature names, or endpoint names.",
    };
  }

  const ranked = rankContext(model, retrieval.ranked);
  const optimized = optimize(ranked);
  const budget = applyBudget(optimized);
  const prompt = await buildPrompt(repo, query, budget);
  const promptTokens = Math.ceil(prompt.length / 4);

  return {
    success: true,
    retrieval,
    confidence: retrieval.confidence,
    budget,
    prompt,
    promptTokens,
  };
}
