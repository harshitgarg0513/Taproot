import { describe, expect, it } from "vitest";
import { scanRepository } from "../src/scanner";

describe("scanner", () => {
  it("counts files", async () => {
    const result = await scanRepository(".");

    expect(result.files).toBeGreaterThan(0);
  });
});
