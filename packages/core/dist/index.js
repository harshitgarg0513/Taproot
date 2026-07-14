// src/builder.ts
import { analyzeRepository } from "@eip/analyzer";
async function buildRepositoryModel(repo) {
  const analysis = await analyzeRepository(repo);
  return {
    components: analysis.components,
    symbols: analysis.symbols,
    relationships: analysis.relationships,
    callGraph: analysis.callGraph
  };
}

// src/query/component.ts
function findComponent(model, name) {
  return model.components.find((c) => c.name.toLowerCase() === name.toLowerCase());
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
    const next = model.relationships.filter((r) => r.to === current);
    for (const edge of next) {
      dfs(edge.from);
    }
  }
  dfs(file);
  return [...visited];
}

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

// src/knowledge/builder.ts
async function buildKnowledge(repo) {
  const model = await buildRepositoryModel(repo);
  return buildKnowledgeGraph(model);
}
export {
  buildKnowledge,
  buildKnowledgeGraph,
  buildRepositoryModel,
  dependenciesOf,
  dependentsOf,
  findComponent,
  findSymbol,
  impactedFiles,
  listComponents
};
