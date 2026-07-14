import fg from "fast-glob";
import { readFile } from "node:fs/promises";

import { parse } from "./parser.js";
import { walkTree } from "./walker.js";
import { RepositoryAnalysis } from "./types.js";

export async function analyzeRepository(root: string): Promise<RepositoryAnalysis> {
  const files = await fg(["**/*.ts"], {
    cwd: root,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  const result: RepositoryAnalysis = {
    files: [],
  };

  for (const file of files) {
    const code = await readFile(file, "utf8");
    const tree = parse(code);
    result.files.push(walkTree(tree, file));
  }

  return result;
}
