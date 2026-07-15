import { analyzeRepository } from "@eip/analyzer";
import { loadConfig } from "@eip/config";
import { observeRepository } from "@eip/observer";
import { err, ok } from "@eip/shared";
import { createCacheKey, getCachedModel, setCachedModel, } from "./cache/index.js";
import { Timer } from "./performance/index.js";
import { buildKnowledgeGraph } from "./knowledge/graph.js";
export async function buildRepositoryModel(repo) {
    const key = createCacheKey(repo);
    const cached = getCachedModel(key);
    if (cached) {
        return ok(cached);
    }
    const totalTimer = new Timer();
    const config = await loadConfig(repo);
    const observerTimer = new Timer();
    const observationResult = await observeRepository(repo);
    const observerMs = observerTimer.end();
    if (!observationResult.success) {
        return err(observationResult.error);
    }
    const analyzerTimer = new Timer();
    const analysisResult = await analyzeRepository(repo);
    const analyzerMs = analyzerTimer.end();
    if (!analysisResult.success) {
        return err(analysisResult.error);
    }
    const graphTimer = new Timer();
    const analysis = analysisResult.data;
    const graph = buildKnowledgeGraph({
        config,
        componentIndex: new Map(),
        symbolIndex: new Map(),
        metrics: {
            observerMs: 0,
            analyzerMs: 0,
            graphMs: 0,
            totalMs: 0,
        },
        components: analysis.components,
        symbols: analysis.symbols,
        entities: analysis.entities,
        classified: analysis.classified,
        relationships: analysis.relationships,
        callGraph: analysis.callGraph,
        knowledgeGraph: {
            nodes: [],
            edges: [],
        },
    });
    const graphMs = graphTimer.end();
    const components = analysis.components;
    const symbols = analysis.symbols;
    const componentIndex = new Map(components.map((component) => [component.id, component]));
    const symbolIndex = new Map(symbols.map((symbol) => [symbol.id, symbol]));
    const model = {
        config,
        metrics: {
            observerMs,
            analyzerMs,
            graphMs,
            totalMs: totalTimer.end(),
        },
        componentIndex,
        symbolIndex,
        components,
        symbols,
        entities: analysis.entities,
        classified: analysis.classified,
        relationships: analysis.relationships,
        callGraph: analysis.callGraph,
        knowledgeGraph: graph,
    };
    setCachedModel(key, model);
    return ok(model);
}
