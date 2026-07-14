import { describe, expect, it } from "vitest";
import fs from "fs-extra";
import os from "os";
import path from "path";

import { loadConfig } from "../src/loader.js";

describe("loadConfig", () => {
  it("returns defaults when no config file exists", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "eip-config-"));
    const config = await loadConfig(dir);

    expect(config.ignore).toContain("node_modules");
    expect(config.output.format).toBe("table");
  });

  it("throws on invalid config", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "eip-config-"));
    await fs.writeJson(path.join(dir, "eip.config.json"), {
      cache: "yes",
    });

    expect(loadConfig(dir)).rejects.toThrow();
  });

  it("loads a valid config file", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "eip-config-"));
    await fs.writeJson(path.join(dir, "eip.config.json"), {
      ignore: ["coverage"],
      languages: ["typescript"],
      cache: true,
      cacheTTL: 60,
      followSymlinks: false,
      output: {
        colors: false,
        format: "json",
      },
    });

    const config = await loadConfig(dir);

    expect(config.ignore).toEqual(["coverage"]);
    expect(config.output.format).toBe("json");
  });

  it("merges defaults with provided values", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "eip-config-"));
    await fs.writeJson(path.join(dir, "eip.config.json"), {
      ignore: ["coverage"],
    });

    const config = await loadConfig(dir);

    expect(config.ignore).toEqual(["coverage"]);
    expect(config.cache).toBe(true);
    expect(config.output.colors).toBe(true);
  });
});
