import { describe, expect, it } from "vitest";
import { analyzeRepository } from "../src/analyzer";

describe("analyzer entrypoint", () => {
  it("analyzes the repository", async () => {
    const result = await analyzeRepository(".");

    expect(result.success).toBe(true);
  });
});
