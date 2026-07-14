import { describe, expect, it } from "vitest";
import { buildRepositoryModel } from "../src";

describe("repository model", () => {
  it("builds", async () => {
    const result = await buildRepositoryModel(".");

    expect(result.success).toBe(true);
  });
});
