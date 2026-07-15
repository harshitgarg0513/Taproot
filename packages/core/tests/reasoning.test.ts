import { describe, expect, it } from "vitest";
import { explain, explainComponent } from "../src/reasoning/explainBuilder.js";
import type { RepositoryModel } from "../src/types.js";

describe("reasoning explain", () => {
  it("resolves components by name", () => {
    const model = createModel();

    const explanation = explainComponent(model, "AuthService");

    expect(explanation?.component).toBe("AuthService");
    expect(explanation?.file).toBe("src/auth/auth.service.ts");
  });

  it("resolves components by file path", () => {
    const model = createModel();

    const explanation = explainComponent(model, "src/auth/auth.service.ts");

    expect(explanation?.component).toBe("AuthService");
  });

  it("resolves symbols when the model has no explicit components", () => {
    const model = createModel();
    model.components = [];
    model.componentIndex = new Map();

    const explanation = explainComponent(model, "buildRepositoryModel");

    expect(explanation?.component).toBe("buildRepositoryModel");
    expect(explanation?.file).toBeTruthy();
  });

  it("builds a responsibility-based explanation for a classified entity", () => {
    const model = createModel();
    model.classified = [
      {
        entity: {
          id: "auth-service",
          kind: "Class",
          name: "AuthService",
          file: "src/auth/auth.service.ts",
          line: 1,
        },
        labels: [
          {
            type: "service",
            confidence: 0.99,
            signals: [
              { name: "name:service", score: 0.4 },
              { name: "folder:service", score: 0.3 },
              { name: "file:service", score: 0.3 },
            ],
          },
        ],
      },
    ];

    const explanation = explain(model, "AuthService");

    expect(explanation?.responsibility).toBe("Business logic layer.");
    expect(explanation?.classification[0]?.type).toBe("service");
  });
});

function createModel(): RepositoryModel {
  const component = {
    id: "auth-service",
    name: "AuthService",
    type: "Service",
    file: "src/auth/auth.service.ts",
    line: 1,
  };

  const symbol = {
    id: "build-repository-model",
    name: "buildRepositoryModel",
    kind: "function",
    file: "src/auth/auth.service.ts",
    line: 10,
  };

  return {
    config: {
      ignore: [],
      languages: ["typescript"],
      cache: true,
      cacheTTL: 300,
      followSymlinks: false,
      output: {
        colors: true,
        format: "table",
      },
    },
    metrics: {
      observerMs: 0,
      analyzerMs: 0,
      graphMs: 0,
      totalMs: 0,
    },
    componentIndex: new Map([[component.id, component]]),
    symbolIndex: new Map([[symbol.id, symbol]]),
    components: [component],
    symbols: [symbol],
    relationships: [],
    callGraph: [],
    knowledgeGraph: {
      nodes: [],
      edges: [],
    },
  } as RepositoryModel;
}
