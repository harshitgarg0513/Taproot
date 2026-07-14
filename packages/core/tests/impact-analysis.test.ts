import { describe, expect, it } from "vitest";
import { analyzeImpact } from "../src/query/impactAnalyzer";
import type { RepositoryModel } from "../src/types";

const model: RepositoryModel = {
  components: [
    {
      id: "comp-1",
      name: "AuthService",
      type: "Service",
      file: "src/auth.ts",
      line: 1,
    },
    {
      id: "comp-2",
      name: "UserController",
      type: "Controller",
      file: "src/user.ts",
      line: 5,
    },
  ],
  symbols: [
    {
      id: "sym-1",
      name: "authenticate",
      kind: "function",
      file: "src/auth.ts",
      line: 2,
    },
    {
      id: "sym-2",
      name: "login",
      kind: "function",
      file: "src/user.ts",
      line: 6,
    },
  ],
  relationships: [
    { from: "src/user.ts", to: "src/auth.ts", type: "imports" },
    { from: "src/auth.ts", to: "src/db.ts", type: "imports" },
  ],
  callGraph: [],
};

describe("impact analysis", () => {
  it("returns impacted components and symbols", () => {
    const result = analyzeImpact(model, "src/auth.ts");

    expect(result.success).toBe(true);
    expect(result.data?.impactedFiles).toContain("src/auth.ts");
    expect(result.data?.impactedComponents).toContain("AuthService");
    expect(result.data?.impactedSymbols).toContain("authenticate");
  });
});
