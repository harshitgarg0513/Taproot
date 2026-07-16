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
  it("returns a failure result when retrieval confidence is low", async () => {
    const model = createModel();

    const result = await buildContext(model, "totally unrelated request xyz");

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected a low-confidence failure");
    }

    expect(result.message).toContain("No repository vocabulary matched");
  });
});
