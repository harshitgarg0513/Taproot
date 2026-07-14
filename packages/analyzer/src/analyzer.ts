import fg from "fast-glob";
import { readFile } from "node:fs/promises";

import { buildDependencyGraph } from "./graph/dependencyGraph.js";
import { parse } from "./parser/parser.js";
import { buildSymbolTable } from "./parser/symbolWalker.js";
import { createProgram } from "./tsCompiler.js";
import { extractDecoratorComponents } from "./component/decoratorExtractor.js";
import { buildCallGraph } from "./graph/callGraph.js";
import { Component, RepositoryAnalysis } from "./types.js";

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
    callGraph: [],
  };

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const tree = parse(source);
    const parsed = buildSymbolTable(tree, file);

    analysis.files.push(parsed);
    analysis.symbols.push(...parsed.symbols);
    analysis.callGraph.push(...buildCallGraph(tree, file));
  }

  analysis.relationships = buildDependencyGraph(analysis);

  const program = createProgram(files);
  const decoratorComponents: Component[] = [];

  for (const source of program.getSourceFiles()) {
    if (!source.fileName.startsWith(root)) continue;
    decoratorComponents.push(...extractDecoratorComponents(source));
  }

  analysis.components = decoratorComponents;

  return analysis;
}
