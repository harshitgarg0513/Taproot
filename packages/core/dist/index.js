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
import { ok as ok3 } from "@eip/shared";
function searchRepository(model, query) {
  const q = query.toLowerCase();
  const components = model.components.filter(
    (component) => component.name.toLowerCase().includes(q)
  );
  const symbols = model.symbols.filter(
    (symbol) => symbol.name.toLowerCase().includes(q)
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

// src/reasoning/summary.ts
function buildSummary(result) {
  return `${result.component} is a ${result.type} defined in ${result.file}. It contains ${result.symbols.length} symbols, imports ${result.imports.length} modules and directly invokes ${result.callees.length} functions.`;
}

// src/reasoning/explain.ts
function normalizeTarget(value) {
  return value.trim().replace(/^\.\//, "").replace(/\\/g, "/").toLowerCase();
}
function resolveComponentFromTarget(model, target) {
  const normalizedTarget = normalizeTarget(target);
  if (model.componentIndex.has(target)) {
    return model.componentIndex.get(target);
  }
  const byName = Array.from(model.components).find(
    (entry) => normalizeTarget(entry.name) === normalizedTarget
  );
  if (byName) {
    return byName;
  }
  const byFile = Array.from(model.components).find(
    (entry) => normalizeTarget(entry.file) === normalizedTarget
  );
  if (byFile) {
    return byFile;
  }
  const matchingSymbol = model.symbols.find(
    (symbol) => normalizeTarget(symbol.name) === normalizedTarget || normalizeTarget(symbol.file) === normalizedTarget || normalizeTarget(symbol.name).includes(normalizedTarget) || normalizedTarget.includes(normalizeTarget(symbol.name))
  );
  if (matchingSymbol) {
    const existingComponent = Array.from(model.components).find(
      (entry) => normalizeTarget(entry.file) === normalizeTarget(matchingSymbol.file)
    );
    if (existingComponent) {
      return existingComponent;
    }
    return {
      id: matchingSymbol.id,
      name: matchingSymbol.name,
      type: matchingSymbol.kind,
      file: matchingSymbol.file,
      line: matchingSymbol.line
    };
  }
  const byFilePathOnly = Array.from(model.components).find(
    (entry) => normalizeTarget(entry.file).includes(normalizedTarget) || normalizedTarget.includes(normalizeTarget(entry.file))
  );
  if (byFilePathOnly) {
    return byFilePathOnly;
  }
  return null;
}
function explainComponent(model, name) {
  const component = resolveComponentFromTarget(model, name);
  if (!component) {
    return null;
  }
  const componentFile = component.file;
  const symbols = model.symbols.filter((symbol) => symbol.file === componentFile).map((symbol) => symbol.name);
  const imports = model.relationships.filter((relationship) => relationship.from === componentFile).map((relationship) => relationship.to);
  const callers = model.callGraph.filter((call) => symbols.includes(call.callee)).map((call) => call.caller);
  const callees = model.callGraph.filter((call) => symbols.includes(call.caller)).map((call) => call.callee);
  return {
    component: component.name,
    type: component.type,
    file: component.file,
    symbols,
    imports,
    dependencies: imports,
    callers,
    callees,
    summary: buildSummary({
      component: component.name,
      type: component.type,
      file: component.file,
      symbols,
      imports,
      dependencies: imports,
      callers,
      callees,
      summary: ""
    })
  };
}

// src/reasoning/formatter.ts
function formatExplain(result) {
  console.log();
  console.log("===================================");
  console.log(result.component);
  console.log("===================================");
  console.log();
  console.log("Type:", result.type);
  console.log("File:", result.file);
  console.log();
  console.log("Symbols");
  console.log(result.symbols);
  console.log();
  console.log("Imports");
  console.log(result.imports);
  console.log();
  console.log("Calls");
  console.log(result.callees);
  console.log();
  console.log("Summary");
  console.log(result.summary);
}
export {
  Timer,
  analyzeImpact,
  buildKnowledge,
  buildKnowledgeGraph,
  buildRepositoryModel,
  buildSummary,
  cacheSize,
  clearCache,
  createCacheKey,
  dependenciesOf,
  dependentsOf,
  explainComponent,
  findComponent,
  findSymbol,
  formatExplain,
  getCachedModel,
  impactedFiles,
  listComponents,
  searchRepository,
  setCachedModel
};
