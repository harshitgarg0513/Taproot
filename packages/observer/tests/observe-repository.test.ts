import { describe, expect, it } from "vitest";
import { observeRepository } from "../src/observer";

describe("observer entrypoint", () => {
  it("observes the current repository", async () => {
    const result = await observeRepository(".");

    expect(result.success).toBe(true);
  });
});
