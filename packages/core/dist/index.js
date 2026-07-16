// src/builder.ts
import path3 from "path";
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
function hydrateRepositoryModel(model) {
  return {
    ...model,
    componentIndex: new Map(
      model.components.map((component) => [component.id, component])
    ),
    symbolIndex: new Map(model.symbols.map((symbol) => [symbol.id, symbol]))
  };
}
function getCachedModel(key) {
  const entry = readCache().get(key);
  if (!entry) return null;
  return hydrateRepositoryModel(entry.model);
}
function setCachedModel(key, model) {
  const cache = readCache();
  cache.set(key, {
    model: {
      config: model.config,
      metrics: model.metrics,
      knowledgeGraph: model.knowledgeGraph,
      components: model.components,
      symbols: model.symbols,
      entities: model.entities,
      classified: model.classified,
      relationships: model.relationships,
      callGraph: model.callGraph
    },
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
  const normalizePath2 = (filePath) => {
    const absoluteRoot = path3.resolve(repo);
    const normalized = filePath.replace(/\\/g, "/");
    const absoluteRootNormalized = absoluteRoot.replace(/\\/g, "/");
    if (normalized.startsWith(absoluteRootNormalized)) {
      return path3.relative(absoluteRoot, normalized).replace(/\\/g, "/");
    }
    return normalized.replace(/^\.\//, "");
  };
  const components = analysis.components.map((component) => ({
    ...component,
    file: normalizePath2(component.file)
  }));
  const symbols = analysis.symbols.map((symbol) => ({
    ...symbol,
    file: normalizePath2(symbol.file)
  }));
  const entities = analysis.entities.map((entity) => ({
    ...entity,
    file: normalizePath2(entity.file)
  }));
  const relationships = analysis.relationships;
  const callGraph = analysis.callGraph.map((call) => ({
    ...call,
    file: normalizePath2(call.file)
  }));
  const componentIndex = new Map(components.map((component) => [component.id, component]));
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
    entities,
    classified: analysis.classified,
    relationships,
    callGraph,
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
  const score = Math.min(
    100,
    impactedFiles2.length * 8 + impactedSymbols.length * 0.5
  );
  let level;
  if (score < 30) {
    level = "LOW";
  } else if (score < 70) {
    level = "MEDIUM";
  } else {
    level = "HIGH";
  }
  return {
    target,
    score,
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

// src/retrieval/confidence.ts
function computeConfidence(matchedVocabulary, filenameMatches, graphCoverage, symbolMatches, queryTokens) {
  const normalized = Math.max(
    0,
    Math.min(
      1,
      (matchedVocabulary * 0.45 + filenameMatches * 0.3 + graphCoverage * 0.15 + symbolMatches * 0.1) / Math.max(1, queryTokens)
    )
  );
  const score = Number((normalized * 100).toFixed(0));
  if (score >= 80) {
    return {
      level: "HIGH",
      score,
      reason: "Repository vocabulary matched strongly.",
      suggestions: []
    };
  }
  if (score >= 50) {
    return {
      level: "MEDIUM",
      score,
      reason: "Partial repository vocabulary matched.",
      suggestions: []
    };
  }
  return {
    level: "LOW",
    score,
    reason: "No repository vocabulary matched.",
    suggestions: [
      "Try component names.",
      "Try feature names.",
      "Try endpoint names."
    ]
  };
}

// src/retrieval/retrieve.ts
function resolvePath(model, id) {
  const component = model.componentIndex.get(id) ?? model.components.find((candidate) => candidate.id === id);
  if (component?.file) {
    return component.file;
  }
  const symbol = model.symbolIndex.get(id) ?? model.symbols.find((candidate) => candidate.id === id);
  if (symbol?.file) {
    return symbol.file;
  }
  const entity = model.entities.find((candidate) => candidate.id === id);
  return entity?.file ?? id;
}
function resolveDetails(model, id) {
  return model.componentIndex.get(id) ?? model.symbolIndex.get(id) ?? model.components.find((candidate) => candidate.id === id) ?? model.symbols.find((candidate) => candidate.id === id) ?? model.entities.find((candidate) => candidate.id === id);
}
function buildEntry(path6, id, score, reasons) {
  return {
    id: path6,
    path: path6,
    score,
    reasons,
    ids: [id]
  };
}
function retrieve(model, query) {
  const tokens = tokenize(query);
  const vocabulary = buildVocabulary(model);
  const candidateScores = generateCandidates(query, vocabulary);
  const byPath = /* @__PURE__ */ new Map();
  for (const [id, tokenCount] of candidateScores) {
    const path6 = resolvePath(model, id);
    const details = resolveDetails(model, id);
    const entry = byPath.get(path6) ?? buildEntry(path6, id, 0, []);
    let score = tokenCount * 8;
    const reasons = new Set(entry.reasons);
    reasons.add("matched vocabulary");
    const normalizedPath = path6.split("/").pop() ?? path6;
    const fileTokens = tokenize(normalizedPath);
    const filenameMatch = fileTokens.some((token) => tokens.includes(token));
    if (filenameMatch) {
      score += 10;
      reasons.add("matched filename");
    }
    if (details && "type" in details && details.type) {
      score += 6;
      reasons.add("matched component");
    } else if (details && "kind" in details && details.kind) {
      score += 4;
      reasons.add("matched symbol");
    }
    entry.score += score;
    entry.reasons = Array.from(reasons);
    entry.ids = Array.from(/* @__PURE__ */ new Set([...entry.ids, id]));
    byPath.set(path6, entry);
  }
  const ranked = Array.from(byPath.values()).sort((a, b) => b.score - a.score);
  const topSeeds = ranked.slice(0, 8).flatMap((item) => item.ids);
  const expanded = expand(model, new Set(topSeeds));
  for (const id of expanded) {
    const path6 = resolvePath(model, id);
    const entry = byPath.get(path6) ?? buildEntry(path6, id, 0, []);
    entry.score += 2;
    entry.reasons = Array.from(/* @__PURE__ */ new Set([...entry.reasons, "graph expansion"]));
    entry.ids = Array.from(/* @__PURE__ */ new Set([...entry.ids, id]));
    byPath.set(path6, entry);
  }
  const finalRanked = Array.from(byPath.values()).sort((a, b) => b.score - a.score);
  const matchedVocabulary = finalRanked.filter((item) => item.reasons.includes("matched vocabulary")).length;
  const filenameMatches = finalRanked.filter((item) => item.reasons.includes("matched filename")).length;
  const symbolMatches = finalRanked.filter((item) => item.reasons.includes("matched symbol")).length;
  const graphCoverage = finalRanked.filter((item) => item.reasons.includes("graph expansion")).length;
  const confidence = computeConfidence(
    matchedVocabulary,
    filenameMatches,
    graphCoverage,
    symbolMatches,
    tokens.length
  );
  return {
    query,
    tokens,
    ranked: finalRanked,
    expanded,
    confidence
  };
}

// src/context/ranker.ts
function rankContext(_model, ranked) {
  const aggregated = /* @__PURE__ */ new Map();
  for (const item of ranked) {
    const existing = aggregated.get(item.path) ?? {
      id: item.path,
      path: item.path,
      score: 0,
      reasons: [],
      ids: []
    };
    existing.score += item.score;
    existing.reasons = Array.from(/* @__PURE__ */ new Set([...existing.reasons, ...item.reasons]));
    existing.ids = Array.from(/* @__PURE__ */ new Set([...existing.ids, ...item.ids]));
    aggregated.set(item.path, existing);
  }
  return Array.from(aggregated.values()).map((item) => {
    let score = item.score;
    const fileName = item.path.split("/").pop() ?? item.path;
    if (fileName === "index.ts" || fileName === "barrel.ts") {
      score -= 2;
    }
    return {
      ...item,
      score
    };
  }).sort((a, b) => b.score - a.score);
}

// src/context/optimizer.ts
function optimize(ranked) {
  const byPath = /* @__PURE__ */ new Map();
  for (const item of ranked) {
    const previous = byPath.get(item.path);
    if (!previous || item.score > previous.score) {
      byPath.set(item.path, item);
    }
  }
  return Array.from(byPath.values()).sort((a, b) => b.score - a.score);
}

// src/context/budget.ts
function applyBudget(items, maxItems = 8, maxTokens = 7e3) {
  let usedTokens = 0;
  const selected = [];
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

// src/context/snippet.ts
import fs3 from "fs/promises";
import path4 from "path";
async function loadSnippet(repo, file, maxLines = 60, preferredTerms = []) {
  const absolutePath = path4.isAbsolute(file) ? file : path4.resolve(repo, file);
  const displayPath = path4.relative(repo, absolutePath) || path4.basename(absolutePath);
  const text = await fs3.readFile(absolutePath, "utf8");
  const lines = text.split(/\r?\n/);
  const meaningful = lines.map((line, index) => ({ line: index + 1, text: line })).filter((entry) => entry.text.trim().length > 0);
  if (meaningful.length === 0) {
    return {
      file: displayPath,
      content: "",
      lines: 0,
      startLine: 1,
      endLine: 1
    };
  }
  let startLine = 1;
  let endLine = Math.min(lines.length, maxLines);
  if (preferredTerms.length > 0) {
    const match = meaningful.find(
      (entry) => preferredTerms.some(
        (term) => entry.text.toLowerCase().includes(term.toLowerCase())
      )
    );
    if (match) {
      startLine = Math.max(1, match.line - 30);
      endLine = Math.min(lines.length, match.line + 60);
    }
  }
  if (startLine === 1 && endLine === Math.min(lines.length, maxLines)) {
    const sample = meaningful.slice(0, maxLines);
    const first = sample[0];
    const last = sample[sample.length - 1];
    if (first && last) {
      startLine = first.line;
      endLine = last.line;
    }
  }
  const content = lines.slice(startLine - 1, endLine).join("\n").trim();
  return {
    file: displayPath,
    content,
    lines: lines.length,
    startLine,
    endLine
  };
}

// src/context/formatter.ts
function formatPrompt(query, snippets) {
  let prompt = `You are a senior backend engineer.

Task

${query}

Repository Context
`;
  for (const snippet of snippets) {
    prompt += `
================================

File

${snippet.file}

Relevant snippet

\`\`\`ts
${snippet.content}
\`\`\`
`;
  }
  prompt += `
================================

Instructions

1. Only modify files shown above.

2. Explain every change.

3. If context is insufficient, explicitly say so.
`;
  return prompt;
}

// src/context/prompt.ts
async function buildPrompt(repo, query, items) {
  const snippets = [];
  for (const item of items) {
    try {
      const preferredTerms = item.reasons.flatMap(
        (reason) => reason.split(/\s+/).filter(Boolean)
      );
      snippets.push(
        await loadSnippet(repo, item.path, 60, preferredTerms)
      );
    } catch (error) {
      void error;
    }
  }
  return formatPrompt(query, snippets);
}

// src/context/provider.ts
import { complete as completeWithAnthropic } from "@eip/anthropic";
import { complete as completeWithGemini } from "@eip/gemini";
function hasAnthropicKey() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  return Boolean(apiKey && apiKey !== "YOUR_KEY");
}
async function complete(prompt) {
  try {
    return await completeWithGemini(prompt);
  } catch (geminiError) {
    if (!hasAnthropicKey()) {
      throw geminiError;
    }
    try {
      return await completeWithAnthropic(prompt);
    } catch (anthropicError) {
      const geminiMessage = geminiError instanceof Error ? geminiError.message : String(geminiError);
      const anthropicMessage = anthropicError instanceof Error ? anthropicError.message : String(anthropicError);
      throw new Error(
        `Generation failed. Gemini: ${geminiMessage} | Anthropic: ${anthropicMessage}`,
        { cause: anthropicError }
      );
    }
  }
}

// src/context/context.ts
async function generate(model, query, repo = process.cwd()) {
  const context = await buildContext(model, query, repo);
  if (!context.success) {
    return {
      context,
      answer: "",
      generation: void 0
    };
  }
  try {
    const generation = await complete(context.prompt);
    return {
      context,
      answer: generation.text,
      generation
    };
  } catch (error) {
    return {
      context,
      answer: "",
      generation: void 0,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}
async function buildContext(model, query, repo = process.cwd()) {
  const retrieval = retrieve(model, query);
  if (retrieval.ranked.length === 0 || retrieval.confidence.level === "LOW") {
    return {
      success: false,
      confidence: retrieval.confidence,
      message: "No repository vocabulary matched. Try component names, feature names, or endpoint names."
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
    promptTokens
  };
}

// src/evaluation/evaluator.ts
import path5 from "path";

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
function normalizePath(filePath, repoRoot) {
  const absoluteRepoRoot = path5.resolve(repoRoot);
  let normalizedPath = filePath.replace(/\\/g, "/");
  if (normalizedPath.startsWith(absoluteRepoRoot.replace(/\\/g, "/"))) {
    normalizedPath = path5.relative(absoluteRepoRoot, normalizedPath).replace(/\\/g, "/");
  }
  normalizedPath = normalizedPath.replace(/^\.\//, "").replace(/^\/+/, "");
  return normalizedPath.toLowerCase();
}
function evaluateCommit(model, message, actualFiles, repoRoot = ".") {
  const retrieval = retrieve(model, message);
  const ranked = rankContext(model, retrieval.ranked);
  const optimized = optimize(ranked);
  const budget = applyBudget(optimized);
  const predicted = new Set(budget.map((item) => normalizePath(item.path, repoRoot)));
  const actual = new Set(actualFiles.map((file) => normalizePath(file, repoRoot)));
  return calculate(predicted, actual);
}

// src/evaluation/report.ts
function formatMetric(value) {
  return value.toFixed(2);
}
function printReport(results) {
  const avg = (key) => {
    if (results.length === 0) {
      return 0;
    }
    return results.reduce((sum, item) => sum + item[key], 0) / results.length;
  };
  console.log();
  console.log("================================");
  console.log("Evaluation");
  console.log("================================");
  console.log();
  console.log("Commits Evaluated");
  console.log(results.length);
  console.log();
  console.log("Precision");
  console.log(formatMetric(avg("precision")));
  console.log();
  console.log("Recall");
  console.log(formatMetric(avg("recall")));
  console.log();
  console.log("F1");
  console.log(formatMetric(avg("f1")));
}

// src/evaluation/history.ts
import { execSync } from "child_process";
function getCommitHistory(repo, limit = 30) {
  const output = execSync(`git -C "${repo}" log --pretty=format:%H:::%s -n ${limit}`).toString();
  return output.split("\n").filter(Boolean).map((line) => {
    const [hash, message] = line.split(":::");
    return {
      hash: hash ?? "",
      message: message ?? ""
    };
  });
}

// src/evaluation/files.ts
import { execSync as execSync2 } from "child_process";
function getChangedFiles(repo, hash) {
  const output = execSync2(`git -C "${repo}" show --pretty='' --name-only ${hash}`).toString();
  return output.split("\n").filter(Boolean);
}

// src/evaluation/commitFilter.ts
function shouldEvaluate(message, files) {
  const msg = message.toLowerCase();
  if (msg.startsWith("merge")) return false;
  if (msg.includes("format")) return false;
  if (msg.includes("lint")) return false;
  if (msg.includes("dependency")) return false;
  if (msg.includes("package")) return false;
  if (files.length > 20) return false;
  if (files.length === 0) return false;
  return true;
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
  complete,
  createCacheKey,
  dependenciesOf,
  dependentsOf,
  evaluateCommit,
  explain,
  explainComponent,
  findComponent,
  findSymbol,
  generate,
  getCachedModel,
  getChangedFiles,
  getCommitHistory,
  hydrateRepositoryModel,
  impactedFiles,
  inferResponsibility,
  listComponents,
  printExplain,
  printReport,
  printRisk,
  retrieve,
  searchRepository,
  setCachedModel,
  shouldEvaluate
};
