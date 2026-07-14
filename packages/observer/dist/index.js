// src/observer.ts
import fs3 from "fs-extra";
import path3 from "path";

// src/scanner.ts
import fs from "fs-extra";
import path from "path";
import { loadConfig } from "@eip/config";
async function scanRepository(root) {
  const config = await loadConfig(root);
  const IGNORE = new Set(config.ignore);
  const result = {
    files: 0,
    directories: 0,
    extensions: /* @__PURE__ */ new Set()
  };
  async function walk(dir) {
    const entries = await fs.readdir(dir, {
      withFileTypes: true
    });
    for (const entry of entries) {
      if (IGNORE.has(entry.name) || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        result.directories++;
        await walk(full);
      } else {
        result.files++;
        const ext = path.extname(entry.name);
        if (ext) {
          result.extensions.add(ext);
        }
      }
    }
  }
  await walk(root);
  return result;
}

// src/detector.ts
import fs2 from "fs-extra";
import path2 from "path";
async function detectProject(root, extensions) {
  const languages = [];
  if (extensions.has(".ts")) languages.push("TypeScript");
  if (extensions.has(".js")) languages.push("JavaScript");
  if (extensions.has(".py")) languages.push("Python");
  if (extensions.has(".go")) languages.push("Go");
  if (extensions.has(".java")) languages.push("Java");
  let framework = null;
  let packageManager = null;
  const packageJson = path2.join(root, "package.json");
  if (await fs2.pathExists(packageJson)) {
    const pkg = await fs2.readJson(packageJson);
    const deps = {
      ...pkg.dependencies ?? {},
      ...pkg.devDependencies ?? {}
    };
    if (deps["@nestjs/core"]) framework = "NestJS";
    else if (deps.next) framework = "Next.js";
    else if (deps.react) framework = "React";
    else if (deps.express) framework = "Express";
    if (pkg.packageManager?.startsWith("pnpm")) packageManager = "pnpm";
    else if (pkg.packageManager?.startsWith("yarn")) packageManager = "yarn";
    else packageManager = "npm";
  }
  return {
    languages,
    framework,
    packageManager
  };
}

// src/observer.ts
import { RepositoryNotFoundError, err, ok } from "@eip/shared";
async function observeRepository(root) {
  const start = performance.now();
  if (!await fs3.pathExists(root)) {
    return err(new RepositoryNotFoundError(root));
  }
  const scan = await scanRepository(root);
  const detection = await detectProject(root, scan.extensions);
  const end = performance.now();
  return ok({
    name: path3.basename(root),
    rootPath: root,
    totalFiles: scan.files,
    totalDirectories: scan.directories,
    languages: detection.languages,
    framework: detection.framework,
    packageManager: detection.packageManager,
    hasGit: await fs3.pathExists(path3.join(root, ".git")),
    scannedAt: /* @__PURE__ */ new Date(),
    scanDurationMs: Math.round(end - start)
  });
}
export {
  observeRepository
};
