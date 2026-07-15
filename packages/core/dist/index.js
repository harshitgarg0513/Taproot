// src/builder.ts
import { analyzeRepository } from "@eip/analyzer";
import { loadConfig } from "@eip/config";
import { observeRepository } from "@eip/observer";
import { err, ok } from "@eip/shared";

// src/cache/cache.ts
import fs from "fs";
import path from "path";
function getCacheFilePath() {
  return path.resolve(process.cwd(), ".eip-cache.json");
}
function readCache() {
  const cacheFile = getCacheFilePath();
  if (!fs.existsSync(cacheFile)) {
    return /* @__PURE__ */ new Map();
  }
  try {
    const raw = fs.readFileSync(cacheFile, "utf8");
    const parsed = JSON.parse(raw);
    return new Map(Object.entries(parsed));
  } catch {
    return /* @__PURE__ */ new Map();
  }
}
function writeCache(cache) {
  const cacheFile = getCacheFilePath();
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  fs.writeFileSync(
    cacheFile,
    JSON.stringify(Object.fromEntries(cache.entries()), null, 2)
  );
}
function getCachedModel(key) {
  const entry = readCache().get(key);
  if (!entry) return null;
  return entry.model;
}
function setCachedModel(key, model) {
  const cache = readCache();
  cache.set(key, {
    model,
    timestamp: Date.now()
  });
  writeCache(cache);
}
function clearCache() {
  const cacheFile = getCacheFilePath();
  if (fs.existsSync(cacheFile)) {
    fs.unlinkSync(cacheFile);
  }
}
function cacheSize() {
  return readCache().size;
}

// src/cache/key.ts
import crypto from "crypto";
import fs2 from "fs";
import path2 from "path";
function walk(dir, files) {
  const entries = fs2.readdirSync(dir, {
    withFileTypes: true
  });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist")
      continue;
    const full = path2.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
}
function createCacheKey(repo) {
  const files = [];
  walk(repo, files);
  const hash = crypto.createHash("sha256");
  files.sort();
  for (const file of files) {
    const stat = fs2.statSync(file);
    hash.update(file);
    hash.update(stat.mtimeMs.toString());
    hash.update(stat.size.toString());
  }
  return hash.digest("hex");
}

// src/performance/timer.ts
var Timer = class {
  start = performance.now();
  end() {
    return performance.now() - this.start;
  }
};

// src/knowledge/graph.ts
function buildKnowledgeGraph(model) {
  const graph = {
    nodes: [],
    edges: []
  };
  for (const component of model.components) {
    graph.nodes.push({
      id: component.id,
      type: "Component",
      label: component.name
    });
  }
  for (const symbol of model.symbols) {
    graph.nodes.push({
      id: symbol.id,
      type: "Symbol",
      label: symbol.name
    });
  }
  for (const component of model.components) {
    const related = model.symbols.filter((s) => s.file === component.file);
    for (const symbol of related) {
      graph.edges.push({
        from: component.id,
        to: symbol.id,
        relation: "contains"
      });
    }
  }
  for (const edge of model.relationships) {
    graph.edges.push({
      from: edge.from,
      to: edge.to,
      relation: "imports"
    });
  }
  for (const call of model.callGraph) {
    graph.edges.push({
      from: call.caller,
      to: call.callee,
      relation: "calls"
    });
  }
  return graph;
}

// src/builder.ts
async function buildRepositoryModel(repo) {
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
    componentIndex: /* @__PURE__ */ new Map(),
    symbolIndex: /* @__PURE__ */ new Map(),
    metrics: {
      observerMs: 0,
      analyzerMs: 0,
      graphMs: 0,
      totalMs: 0
    },
    components: analysis.components,
    symbols: analysis.symbols,
    entities: analysis.entities,
    classified: analysis.classified,
    relationships: analysis.relationships,
    callGraph: analysis.callGraph,
    knowledgeGraph: {
      nodes: [],
      edges: []
    }
  });
  const graphMs = graphTimer.end();
  const components = analysis.components;
  const symbols = analysis.symbols;
  const componentIndex = new Map(
    components.map((component) => [component.id, component])
  );
  const symbolIndex = new Map(symbols.map((symbol) => [symbol.id, symbol]));
  const model = {
    config,
    metrics: {
      observerMs,
      analyzerMs,
      graphMs,
      totalMs: totalTimer.end()
    },
    componentIndex,
    symbolIndex,
    components,
    symbols,
    entities: analysis.entities,
    classified: analysis.classified,
    relationships: analysis.relationships,
    callGraph: analysis.callGraph,
    knowledgeGraph: graph
  };
  setCachedModel(key, model);
  return ok(model);
}

// src/query/component.ts
function findComponent(model, name) {
  const normalized = name.toLowerCase();
  for (const component of model.components) {
    if (component.name.toLowerCase() === normalized) {
      return component;
    }
  }
  return void 0;
}
function listComponents(model) {
  return [...model.components];
}

// src/query/symbol.ts
function findSymbol(model, name) {
  return model.symbols.filter((s) => s.name === name);
}

// src/query/dependency.ts
function dependenciesOf(model, file) {
  return model.relationships.filter((r) => r.from === file);
}
function dependentsOf(model, file) {
  return model.relationships.filter((r) => r.to === file);
}

// src/query/impact.ts
function impactedFiles(model, file) {
  const visited = /* @__PURE__ */ new Set();
  function dfs(current) {
    if (visited.has(current)) return;
    visited.add(current);
    const next = model.relationships.filter((r) => r.from === current);
    for (const edge of next) {
      dfs(edge.to);
    }
  }
  dfs(file);
  return [...visited];
}

// src/query/impactAnalyzer.ts
import { ok as ok2 } from "@eip/shared";
function analyzeImpact(model, changedFile) {
  const impactedFiles2 = /* @__PURE__ */ new Set();
  const impactedComponents = /* @__PURE__ */ new Set();
  const impactedSymbols = /* @__PURE__ */ new Set();
  function dfs(file) {
    if (impactedFiles2.has(file)) return;
    impactedFiles2.add(file);
    for (const edge of model.relationships) {
      if (edge.to === file) {
        dfs(edge.from);
      }
    }
  }
  dfs(changedFile);
  for (const symbol of model.symbols) {
    if (impactedFiles2.has(symbol.file)) {
      impactedSymbols.add(symbol.name);
    }
  }
  for (const component of model.components) {
    if (impactedFiles2.has(component.file)) {
      impactedComponents.add(component.name);
    }
  }
  return ok2({
    changedFile,
    impactedFiles: [...impactedFiles2],
    impactedComponents: [...impactedComponents],
    impactedSymbols: [...impactedSymbols]
  });
}

// src/query/search.ts
import { matches, ok as ok3 } from "@eip/shared";
function searchRepository(model, query) {
  const components = model.components.filter(
    (component) => matches(query, component.name) || matches(query, component.file)
  );
  const symbols = model.symbols.filter(
    (symbol) => matches(query, symbol.name) || matches(query, symbol.file)
  );
  const files = [
    .../* @__PURE__ */ new Set([
      ...components.map((component) => component.file),
      ...symbols.map((symbol) => symbol.file)
    ])
  ];
  return ok3({
    components,
    symbols,
    files
  });
}

// src/knowledge/builder.ts
import { err as err2, ok as ok4 } from "@eip/shared";
async function buildKnowledge(repo) {
  const modelResult = await buildRepositoryModel(repo);
  if (!modelResult.success) {
    return err2(modelResult.error);
  }
  return ok4(modelResult.data.knowledgeGraph);
}

// src/reasoning/explainBuilder.ts
import { matches as matches2 } from "@eip/shared";

// src/reasoning/dependencyReasoner.ts
function buildDependencySummary(model, file) {
  const imports = model.relationships.filter((relationship) => relationship.from === file).map((relationship) => relationship.to);
  const importedBy = model.relationships.filter((relationship) => relationship.to === file).map((relationship) => relationship.from);
  const calls = model.callGraph.filter((call) => call.file === file).map((call) => call.callee);
  const calledBy = model.callGraph.filter((call) => call.callee === file).map((call) => call.caller);
  return {
    imports,
    importedBy,
    calls,
    calledBy
  };
}

// src/reasoning/responsibility.ts
function inferResponsibility(entity) {
  const label = entity.labels[0]?.type;
  switch (label) {
    case "service":
      return "Business logic layer.";
    case "controller":
      return "Entry point for requests.";
    case "repository":
      return "Database access.";
    case "module":
      return "Dependency wiring.";
    default:
      return "General code unit.";
  }
}

// src/reasoning/explainBuilder.ts
function explainComponent(model, query) {
  const component = model.components.find((candidate) => {
    return matches2(query, candidate.name) || matches2(query, candidate.file);
  });
  if (component) {
    return {
      component: component.name,
      file: component.file,
      kind: component.type,
      source: "component"
    };
  }
  const symbol = model.symbols.find((candidate) => {
    return matches2(query, candidate.name) || matches2(query, candidate.file);
  });
  if (symbol) {
    return {
      component: symbol.name,
      file: symbol.file,
      kind: symbol.kind,
      source: "symbol"
    };
  }
  return null;
}
function explain(model, entityName) {
  const entity = model.classified.find((entry) => {
    return matches2(entityName, entry.entity.name) || matches2(entityName, entry.entity.file);
  });
  if (!entity) {
    return null;
  }
  const dependency = buildDependencySummary(model, entity.entity.file);
  return {
    name: entity.entity.name,
    kind: entity.entity.kind,
    classification: entity.labels,
    responsibility: inferResponsibility(entity),
    dependency
  };
}

// src/reasoning/formatterV2.ts
function printExplain(e) {
  console.log();
  console.log("================================");
  console.log(e.name);
  console.log("================================");
  console.log();
  console.log("Kind:", e.kind);
  console.log();
  console.log("Responsibility");
  console.log(e.responsibility);
  console.log();
  console.log("Classification");
  console.table(e.classification);
  console.log();
  console.log("Imports");
  console.table(e.dependency.imports);
  console.log();
  console.log("Imported By");
  console.table(e.dependency.importedBy);
  console.log();
  console.log("Calls");
  console.table(e.dependency.calls);
  console.log();
  console.log("Called By");
  console.table(e.dependency.calledBy);
}

// src/reasoning/risk.ts
import { matches as matches3 } from "@eip/shared";
function analyzeRisk(model, target) {
  const seedFiles = /* @__PURE__ */ new Set();
  for (const component of model.components) {
    if (matches3(target, component.name) || matches3(target, component.file)) {
      seedFiles.add(component.file);
    }
  }
  for (const symbol of model.symbols) {
    if (matches3(target, symbol.name) || matches3(target, symbol.file)) {
      seedFiles.add(symbol.file);
    }
  }
  const targetMatches = model.relationships.filter((relationship) => {
    return seedFiles.has(relationship.from) || seedFiles.has(relationship.to) || matches3(target, relationship.from) || matches3(target, relationship.to);
  });
  const impactedFiles2 = Array.from(
    new Set(
      targetMatches.flatMap((relationship) => [relationship.from, relationship.to])
    )
  );
  const impactedSymbols = model.symbols.filter((symbol) => impactedFiles2.includes(symbol.file)).map((symbol) => symbol.name);
  const impactedComponents = model.classified.filter((component) => impactedFiles2.includes(component.entity.file)).map((component) => component.entity.name);
  const score2 = Math.min(
    100,
    impactedFiles2.length * 8 + impactedSymbols.length * 0.5
  );
  let level;
  if (score2 < 30) {
    level = "LOW";
  } else if (score2 < 70) {
    level = "MEDIUM";
  } else {
    level = "HIGH";
  }
  return {
    target,
    score: score2,
    level,
    impactedFiles: [...new Set(impactedFiles2)],
    impactedSymbols: [...new Set(impactedSymbols)],
    impactedComponents: [...new Set(impactedComponents)]
  };
}

// src/reasoning/formatterRisk.ts
function printRisk(result) {
  console.log();
  console.log("================================");
  console.log("Risk Analysis");
  console.log("================================");
  console.log();
  console.log("Target:", result.target);
  console.log("Risk:", result.level, `(${result.score}/100)`);
  console.log();
  console.log("Impacted Components");
  console.table(result.impactedComponents);
  console.log();
  console.log("Impacted Files");
  console.table(result.impactedFiles);
  console.log();
  console.log("Impacted Symbols");
  console.table(result.impactedSymbols);
}

// src/retrieval/tokenizer.ts
var STOP_WORDS = /* @__PURE__ */ new Set([
  "a",
  "an",
  "the",
  "to",
  "for",
  "of",
  "implement",
  "create",
  "add",
  "make",
  "support",
  "enable",
  "allow",
  "using",
  "with",
  "in",
  "on"
]);
function tokenize(query) {
  return query.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).filter((token) => !STOP_WORDS.has(token));
}

// src/retrieval/vocabulary.ts
function buildVocabulary(model) {
  const vocabulary = /* @__PURE__ */ new Map();
  function add(token, id) {
    if (!vocabulary.has(token)) {
      vocabulary.set(token, /* @__PURE__ */ new Set());
    }
    vocabulary.get(token).add(id);
  }
  function addAliases(token, id) {
    add(token, id);
    if (token.length > 3 && token.endsWith("s")) {
      add(token.slice(0, -1), id);
    } else if (token.length > 3) {
      add(`${token}s`, id);
    }
  }
  const split = (text) => text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_.-]/g, " ").toLowerCase().split(/\s+/).filter(Boolean);
  for (const entity of model.entities) {
    for (const token of split(entity.name)) {
      addAliases(token, entity.id);
    }
  }
  for (const symbol of model.symbols) {
    for (const token of split(symbol.name)) {
      addAliases(token, symbol.id);
    }
  }
  return vocabulary;
}

// src/retrieval/candidates.ts
function generateCandidates(query, vocabulary) {
  const scores = /* @__PURE__ */ new Map();
  for (const token of tokenize(query)) {
    const ids = vocabulary.get(token);
    if (!ids) continue;
    for (const id of ids) {
      scores.set(id, (scores.get(id) ?? 0) + 1);
    }
  }
  return scores;
}

// src/retrieval/scorer.ts
function score(candidateScores) {
  const results = [];
  for (const [id, score2] of candidateScores) {
    results.push({
      id,
      score: score2,
      reasons: ["matched repository vocabulary"]
    });
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

// src/retrieval/expander.ts
function expand(model, seedIds) {
  const visited = new Set(seedIds);
  const queue = [...seedIds];
  while (queue.length) {
    const current = queue.shift();
    for (const edge of model.knowledgeGraph.edges) {
      if (edge.from === current && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }
      if (edge.to === current && !visited.has(edge.from)) {
        visited.add(edge.from);
        queue.push(edge.from);
      }
    }
  }
  return visited;
}

// src/retrieval/retrieve.ts
function retrieve(model, query) {
  const vocabulary = buildVocabulary(model);
  const candidateScores = generateCandidates(query, vocabulary);
  const ranked = score(candidateScores);
  const seeds = new Set(ranked.slice(0, 10).map((result) => result.id));
  const expanded = expand(model, seeds);
  return {
    query,
    tokens: tokenize(query),
    ranked,
    expanded
  };
}

// src/context/ranker.ts
function rankContext(model, expanded) {
  const ranked = [];
  for (const id of expanded) {
    let score2 = 0;
    const reasons = [];
    const degree = model.knowledgeGraph.edges.filter(
      (edge) => edge.from === id || edge.to === id
    ).length;
    score2 += degree;
    reasons.push(`graph-degree:${degree}`);
    const component = model.componentIndex.get(id) ?? model.components.find((candidate) => candidate.id === id);
    const symbol = model.symbolIndex.get(id) ?? model.symbols.find((candidate) => candidate.id === id);
    const displayId = component?.name ?? symbol?.name ?? id;
    ranked.push({
      id: displayId,
      score: score2,
      reasons
    });
  }
  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}

// src/context/optimizer.ts
function optimize(ranked) {
  const seen = /* @__PURE__ */ new Set();
  return ranked.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

// src/context/budget.ts
function applyBudget(items, maxItems = 20) {
  return items.slice(0, maxItems);
}

// src/context/prompt.ts
function buildPrompt(query, context) {
  let prompt = `Engineering Task

${query}

Relevant Repository Context
`;
  for (const item of context) {
    prompt += `
${item.id}`;
  }
  return prompt;
}

// src/context/context.ts
function buildContext(model, query) {
  const retrieval = retrieve(model, query);
  const fallbackIds = [
    ...model.components.slice(0, 8).map((component) => component.id),
    ...model.symbols.slice(0, 8).map((symbol) => symbol.id),
    ...model.entities.slice(0, 8).map((entity) => entity.id)
  ];
  const seedIds = retrieval.expanded.size > 0 ? retrieval.expanded : new Set(
    fallbackIds.length > 0 ? fallbackIds : query.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter(Boolean).slice(0, 8)
  );
  const ranked = rankContext(model, seedIds);
  const optimized = optimize(ranked);
  const budget = applyBudget(optimized);
  const prompt = buildPrompt(query, budget);
  return {
    retrieval,
    budget,
    prompt
  };
}

// src/evaluation/metrics.ts
function calculate(predicted, actual) {
  const intersection = [...predicted].filter((x) => actual.has(x)).length;
  const precision = intersection / Math.max(predicted.size, 1);
  const recall = intersection / Math.max(actual.size, 1);
  const f1 = precision + recall === 0 ? 0 : 2 * precision * recall / (precision + recall);
  return {
    precision,
    recall,
    f1
  };
}

// src/evaluation/evaluator.ts
function evaluateCommit(model, message, actualFiles) {
  const retrieval = retrieve(model, message);
  const predicted = new Set(retrieval.ranked.map((result) => result.id));
  return calculate(predicted, new Set(actualFiles));
}

// src/evaluation/report.ts
function printReport(results) {
  const avg = (key) => results.reduce((sum, item) => sum + item[key], 0) / results.length;
  console.log();
  console.log("================================");
  console.log("Evaluation");
  console.log("================================");
  console.log();
  console.table({
    Precision: avg("precision"),
    Recall: avg("recall"),
    F1: avg("f1")
  });
}
export {
  Timer,
  analyzeImpact,
  analyzeRisk,
  buildContext,
  buildDependencySummary,
  buildKnowledge,
  buildKnowledgeGraph,
  buildRepositoryModel,
  cacheSize,
  clearCache,
  createCacheKey,
  dependenciesOf,
  dependentsOf,
  evaluateCommit,
  explain,
  explainComponent,
  findComponent,
  findSymbol,
  getCachedModel,
  impactedFiles,
  inferResponsibility,
  listComponents,
  printExplain,
  printReport,
  printRisk,
  retrieve,
  searchRepository,
  setCachedModel
};
