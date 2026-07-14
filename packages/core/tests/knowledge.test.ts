import { describe, expect, it } from "vitest";
import { buildKnowledgeGraph } from "../src/knowledge/graph";
import { RepositoryModel } from "../src/types";

const model: RepositoryModel = {
  components: [
    { id: "comp-1", name: "AuthService", type: "Service", file: "src/auth.ts", line: 1 },
  ],
  symbols: [
    { id: "sym-1", name: "authenticate", kind: "function", file: "src/auth.ts", line: 2 },
  ],
  relationships: [
    { from: "src/auth.ts", to: "src/db.ts", type: "imports" },
  ],
  callGraph: [],
};

describe("knowledge graph", () => {
  it("builds nodes and edges", () => {
    const graph = buildKnowledgeGraph(model);

    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);
  });
});
