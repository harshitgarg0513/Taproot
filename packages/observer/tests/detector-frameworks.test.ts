import { describe, expect, it } from "vitest";
import { detectProject } from "../src/detector";
import fs from "fs-extra";
import path from "path";

describe("detector framework branches", () => {
  it("detects NestJS, Next.js, React, and Express from dependency names", async () => {
    const tempDir = path.join(process.cwd(), ".tmp-detector-branches");
    await fs.mkdirp(tempDir);

    await fs.writeJson(path.join(tempDir, "package.json"), {
      dependencies: {
        "@nestjs/core": "^10.0.0",
        next: "^14.0.0",
        react: "^18.0.0",
        express: "^4.0.0",
      },
      packageManager: "pnpm@9.0.0",
    });

    const result = await detectProject(tempDir, new Set([".ts"]));

    expect(result.framework).toBe("NestJS");
    expect(result.packageManager).toBe("pnpm");

    await fs.remove(tempDir);
  });
});
