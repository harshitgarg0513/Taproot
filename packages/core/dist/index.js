// src/model.ts
import { analyzeRepository } from "@eip/analyzer";
async function buildRepositoryModel(repo) {
  const analysis = await analyzeRepository(repo);
  return {
    components: analysis.components,
    symbols: analysis.symbols,
    relationships: analysis.relationships
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
export {
  buildRepositoryModel,
  dependenciesOf,
  dependentsOf,
  findComponent,
  findSymbol,
  impactedFiles,
  listComponents
};
