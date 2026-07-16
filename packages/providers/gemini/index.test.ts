import { afterEach, describe, expect, it } from "vitest";
import { complete } from "./index.js";

describe("Gemini provider", () => {
  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
  });

  it("throws when no API key is configured", async () => {
    process.env.GEMINI_API_KEY = "";
    await expect(complete("hello")).rejects.toThrow("not configured");
  });
});
