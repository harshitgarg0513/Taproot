import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildPrompt } from "../src/context/prompt.js";

describe("buildPrompt", () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it("includes file paths and source content in the prompt", async () => {
    const dir = await mkdtemp(join(tmpdir(), "sclare-prompt-"));
    tempDirs.push(dir);

    const file = join(dir, "sample.ts");
    await mkdir(dir, { recursive: true });
    await writeFile(file, "export const value = 1;\n", "utf8");

    const prompt = await buildPrompt(dir, "implement refresh tokens", [
      {
        id: "sample.ts",
        path: "sample.ts",
        score: 10,
        reasons: ["matched vocabulary"],
        ids: [],
      },
    ]);

    expect(prompt).toContain("Task");
    expect(prompt).toContain("implement refresh tokens");
    expect(prompt).toContain("sample.ts");
    expect(prompt).toContain("export const value = 1;");
    expect(prompt).toContain("Instructions");
  });
});
