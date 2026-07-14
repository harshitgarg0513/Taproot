import { describe, expect, it } from "vitest";
import { detectProject } from "../src/detector";

describe("observer detector branches", () => {
  it("detects framework and package manager from package.json", async () => {
    const result = await detectProject(".", new Set([".ts", ".js", ".py"]));

    expect(result.languages).toContain("TypeScript");
    expect(result.packageManager).toBeTruthy();
  });
});
