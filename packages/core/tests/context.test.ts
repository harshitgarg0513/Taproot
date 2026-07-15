import { describe, expect, it } from "vitest";
import { buildContext } from "../src/context/context.js";
import type { RepositoryModel } from "../src/types.js";

function createModel(overrides: Partial<RepositoryModel> = {}): RepositoryModel {
  return {
    config: {} as RepositoryModel["config"],
    metrics: {
      observerMs: 0,
      analyzerMs: 0,
      graphMs: 0,
      totalMs: 0,
    },
    knowledgeGraph: {
      nodes: [],
      edges: [],
    },
    componentIndex: new Map(),
    symbolIndex: new Map(),
    components: [],
    symbols: [],
    entities: [],
    classified: [],
    relationships: [],
    callGraph: [],
    ...overrides,
  };
}

describe("buildContext", () => {
  it("falls back to repository components when retrieval yields no expanded nodes", () => {
    const model = createModel({
      components: [{ id: "component-1", name: "AuthService", type: "component", file: "src/auth.ts", line: 1 }],
      symbols: [],
      entities: [],
      knowledgeGraph: {
        nodes: [],
        edges: [],
      },
    });

    const result = buildContext(model, "implement refresh tokens");

    expect(result.budget.some((item) => item.id === "AuthService")).toBe(true);
    expect(result.prompt).toContain("Engineering Task");
  });
});
