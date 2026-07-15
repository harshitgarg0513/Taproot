import { describe, expect, it } from "vitest";
import { retrieve } from "../src/retrieval/retrieve";
import type { RepositoryModel } from "../src/types.js";

const model: RepositoryModel = {
  config: {} as RepositoryModel["config"],
  metrics: {} as RepositoryModel["metrics"],
  knowledgeGraph: {
    nodes: [],
    edges: [
      { from: "service-1", to: "repo-1", relation: "contains" },
      { from: "service-1", to: "service-2", relation: "calls" },
    ],
  },
  componentIndex: new Map(),
  symbolIndex: new Map(),
  components: [],
  symbols: [],
  entities: [
    {
      id: "service-1",
      kind: "Class",
      name: "RefreshTokenService",
      file: "src/auth.ts",
      line: 1,
    },
    {
      id: "repo-1",
      kind: "Class",
      name: "TokenRepository",
      file: "src/repository.ts",
      line: 2,
    },
    {
      id: "service-2",
      kind: "Class",
      name: "AuthService",
      file: "src/auth.ts",
      line: 3,
    },
  ] as RepositoryModel["entities"],
  classified: [],
  relationships: [],
  callGraph: [],
};

describe("retrieve", () => {
  it("builds tokenized retrieval results and expansion", () => {
    const result = retrieve(model, "implement refresh tokens");

    expect(result.tokens).toEqual(["refresh", "tokens"]);
    expect(result.ranked[0]?.id).toBe("service-1");
    expect(result.expanded.has("service-1")).toBe(true);
    expect(result.expanded.has("repo-1")).toBe(true);
  });
});
