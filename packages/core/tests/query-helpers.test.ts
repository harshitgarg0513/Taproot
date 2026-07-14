import { describe, expect, it } from "vitest";
import { findComponent, listComponents } from "../src/query/component";
import { dependenciesOf, dependentsOf } from "../src/query/dependency";
import { impactedFiles } from "../src/query/impact";
import { searchRepository } from "../src/query/search";
import { findSymbol } from "../src/query/symbol";
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
  callGraph: [
    { caller: "src/user.ts", callee: "src/auth.ts", file: "src/user.ts" },
  ],
};

describe("core query helpers", () => {
  it("finds and lists components", () => {
    expect(findComponent(model, "authservice")?.name).toBe("AuthService");
    expect(listComponents(model)).toHaveLength(2);
  });

  it("returns dependency and dependent relationships", () => {
    expect(dependenciesOf(model, "src/user.ts")).toHaveLength(1);
    expect(dependentsOf(model, "src/auth.ts")).toHaveLength(1);
  });

  it("finds impacted files through relationships", () => {
    expect(impactedFiles(model, "src/user.ts")).toEqual([
      "src/user.ts",
      "src/auth.ts",
      "src/db.ts",
    ]);
  });

  it("searches components and symbols", () => {
    const result = searchRepository(model, "auth");

    expect(result.success).toBe(true);
    expect(result.data?.components).toHaveLength(1);
    expect(result.data?.symbols).toHaveLength(1);
    expect(result.data?.files).toContain("src/auth.ts");
  });

  it("finds symbols by name", () => {
    expect(findSymbol(model, "authenticate")).toHaveLength(1);
  });
});
