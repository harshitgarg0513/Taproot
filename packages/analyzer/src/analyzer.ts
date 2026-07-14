import fg from "fast-glob";
import { readFile } from "node:fs/promises";

import { extractComponents } from "./component.js";
import { buildDependencyGraph } from "./graph.js";
import { parse } from "./parser.js";
import { buildSymbolTable } from "./symbolWalker.js";
import { RepositoryAnalysis } from "./types.js";

export async function analyzeRepository(root: string): Promise<RepositoryAnalysis> {
  const files = await fg(["**/*.ts"], {
    cwd: root,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  const analysis: RepositoryAnalysis = {
    files: [],
    symbols: [],
    relationships: [],
    components: [],
  };

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const tree = parse(source);
    const parsed = buildSymbolTable(tree, file);

    analysis.files.push(parsed);
    analysis.symbols.push(...parsed.symbols);
  }

  analysis.relationships = buildDependencyGraph(analysis);
  analysis.components = extractComponents(analysis);

  return analysis;
}
