import path from "node:path";
import { analyzeRepository } from "@eip/analyzer";
import { loadConfig } from "@eip/config";
import { observeRepository } from "@eip/observer";

import { RepositoryModel } from "./types.js";
import { Result, err, ok } from "@eip/shared";
import {
  createCacheKey,
  getCachedModel,
  setCachedModel,
} from "./cache/index.js";
import { Timer } from "./performance/index.js";
import { buildKnowledgeGraph } from "./knowledge/graph.js";

export async function buildRepositoryModel(
  repo: string,
): Promise<Result<RepositoryModel>> {
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
  } as RepositoryModel);
  const graphMs = graphTimer.end();

  const normalizePath = (filePath: string) => {
    const absoluteRoot = path.resolve(repo);
    const normalized = filePath.replace(/\\/g, "/");
    const absoluteRootNormalized = absoluteRoot.replace(/\\/g, "/");

    if (normalized.startsWith(absoluteRootNormalized)) {
      return path.relative(absoluteRoot, normalized).replace(/\\/g, "/");
    }

    return normalized.replace(/^\.\//, "");
  };

  const components = analysis.components.map((component) => ({
    ...component,
    file: normalizePath(component.file),
  }));
  const symbols = analysis.symbols.map((symbol) => ({
    ...symbol,
    file: normalizePath(symbol.file),
  }));
  const entities = analysis.entities.map((entity) => ({
    ...entity,
    file: normalizePath(entity.file),
  }));
  const relationships = analysis.relationships;
  const callGraph = analysis.callGraph.map((call) => ({
    ...call,
    file: normalizePath(call.file),
  }));
  const componentIndex = new Map(components.map((component) => [component.id, component]));
  const symbolIndex = new Map(symbols.map((symbol) => [symbol.id, symbol]));

  const model: RepositoryModel = {
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
    entities,
    classified: analysis.classified,
    relationships,
    callGraph,
    knowledgeGraph: graph,
  };

  setCachedModel(key, model);

  return ok(model);
}
