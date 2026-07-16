import { describe, expect, it } from "vitest";
import { computeConfidence } from "../src/retrieval/confidence.js";

describe("computeConfidence", () => {
  it("returns high confidence when vocabulary matches are strong", () => {
    const result = computeConfidence(4, 4, 4, 4, 4);

    expect(result.level).toBe("HIGH");
  });

  it("returns low confidence for weak matches", () => {
    const result = computeConfidence(1, 1, 1, 0, 10);

    expect(result.level).toBe("LOW");
  });
});
