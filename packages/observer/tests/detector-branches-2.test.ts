import { describe, expect, it } from "vitest";
import { detectProject } from "../src/detector";
import fs from "fs-extra";
import path from "path";

describe("detector additional branches", () => {
  it("covers yarn and react/express fallback branches", async () => {
    const tempDir = path.join(process.cwd(), ".tmp-detector-branches-2");
    await fs.mkdirp(tempDir);

    await fs.writeJson(path.join(tempDir, "package.json"), {
      dependencies: {
        react: "^18.0.0",
        express: "^4.0.0",
      },
      packageManager: "yarn@4.0.0",
    });

    const result = await detectProject(tempDir, new Set([".go", ".java"]));

    expect(result.framework).toBe("React");
    expect(result.packageManager).toBe("yarn");

    await fs.remove(tempDir);
  });
});
