import { describe, expect, it } from "vitest";
import { analyzeRisk } from "../src/reasoning/risk.js";
import type { RepositoryModel } from "../src/types.js";

describe("risk analysis", () => {
  it("scores impacted relationships and symbols", () => {
    const model: RepositoryModel = {
      config: {} as RepositoryModel["config"],
      metrics: {} as RepositoryModel["metrics"],
      knowledgeGraph: { nodes: [], edges: [] },
      componentIndex: new Map(),
      symbolIndex: new Map(),
      components: [],
      symbols: [{ id: "s1", name: "auth", kind: "function", file: "src/auth.ts", line: 1 }],
      entities: [],
      classified: [
        {
          entity: { id: "c1", kind: "Class", name: "AuthService", file: "src/auth.ts", line: 1 },
          labels: [{ type: "service", confidence: 0.99, signals: [] }],
        },
      ],
      relationships: [{ from: "src/auth.ts", to: "src/db.ts", type: "imports" }],
      callGraph: [],
    };

    const result = analyzeRisk(model, "auth");

    expect(result.level).toBe("LOW");
    expect(result.impactedComponents).toContain("AuthService");
    expect(result.impactedFiles).toContain("src/auth.ts");
  });
});
