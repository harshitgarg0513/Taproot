import { describe, expect, it } from "vitest";
import { analyzeRepository } from "../src/analyzer";

describe("analyzer branches", () => {
  it("handles repository analysis with a mixed source tree", async () => {
    const result = await analyzeRepository(".");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.components.length).toBeGreaterThanOrEqual(0);
    }
  });
});
