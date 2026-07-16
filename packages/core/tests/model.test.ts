import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildRepositoryModel, clearCache, getCachedModel } from "../src";

describe("repository model", () => {
  it("builds", async () => {
    const result = await buildRepositoryModel(".");

    expect(result.success).toBe(true);
  });

  it("rehydrates cached models without persisting runtime maps", () => {
    const cacheFile = path.resolve(process.cwd(), ".eip-cache.json");
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    clearCache();

    fs.writeFileSync(
      cacheFile,
      JSON.stringify({
        repo: {
          timestamp: 1,
          model: {
            config: {},
            metrics: {
              observerMs: 1,
              analyzerMs: 2,
              graphMs: 3,
              totalMs: 6,
            },
            knowledgeGraph: {
              nodes: [],
              edges: [],
            },
            components: [
              {
                id: "component-1",
                name: "ExampleComponent",
                type: "Controller",
                file: "src/example.ts",
                line: 1,
              },
            ],
            symbols: [
              {
                id: "symbol-1",
                name: "example",
                kind: "function",
                file: "src/example.ts",
                line: 2,
              },
            ],
            entities: [],
            classified: [],
            relationships: [],
            callGraph: [],
          },
        },
      }),
    );

    const cached = getCachedModel("repo");

    expect(cached).not.toBeNull();
    expect(cached?.componentIndex instanceof Map).toBe(true);
    expect(cached?.symbolIndex instanceof Map).toBe(true);
    expect(cached?.componentIndex.get("component-1")?.name).toBe(
      "ExampleComponent",
    );
    expect(cached?.symbolIndex.get("symbol-1")?.name).toBe("example");
  });
});
