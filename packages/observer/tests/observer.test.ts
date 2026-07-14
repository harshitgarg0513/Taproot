import { describe, expect, it } from "vitest";
import { detectProject } from "../src/detector";

describe("observer detector", () => {
  it("detects project metadata", async () => {
    const result = await detectProject(".", new Set([".ts", ".js"]));

    expect(result.languages).toContain("TypeScript");
    expect(result.packageManager).toBeTruthy();
  });
});
