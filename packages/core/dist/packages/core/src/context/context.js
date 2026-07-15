import { retrieve } from "../retrieval/index.js";
import { rankContext } from "./ranker.js";
import { optimize } from "./optimizer.js";
import { applyBudget } from "./budget.js";
import { buildPrompt } from "./prompt.js";
import { complete } from "./provider.js";
export async function generate(model, query) {
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
export async function buildContext(model, query) {
    const retrieval = retrieve(model, query);
    if (retrieval.confidence.level === "LOW") {
        return {
            success: false,
            confidence: retrieval.confidence,
            message: "Unable to identify reliable repository context.",
        };
    }
    const seedIds = retrieval.expanded.size > 0 ? retrieval.expanded : new Set();
    const ranked = rankContext(model, seedIds);
    const optimized = optimize(ranked);
    const budget = applyBudget(optimized);
    const prompt = await buildPrompt(query, budget.map((item) => item.path));
    return {
        success: true,
        retrieval,
        confidence: retrieval.confidence,
        budget,
        prompt,
    };
}
