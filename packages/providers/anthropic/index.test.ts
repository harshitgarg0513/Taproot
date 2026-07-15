import { afterEach, describe, expect, it } from "vitest";
import { complete } from "./index.js";

describe("Anthropic provider", () => {
  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("throws when no API key is configured", async () => {
    await expect(complete("hello")).rejects.toThrow("ANTHROPIC_API_KEY");
  });
});
