import fg from "fast-glob";
import { readFile } from "node:fs/promises";

import { buildDependencyGraph } from "./graph/dependencyGraph.js";
import { parse } from "./parser/parser.js";
import { buildMasterWalker } from "./parser/masterWalker.js";
import { createProgram } from "./tsCompiler.js";
import { extractDecoratorComponents } from "./component/decoratorExtractor.js";
import { buildCallGraph } from "./graph/callGraph.js";
import { extractEntities } from "./entity/extractor.js";
import { Component, RepositoryAnalysis } from "./types.js";
import { Result, err, ok } from "@eip/shared";

export async function analyzeRepository(
  root: string,
): Promise<Result<RepositoryAnalysis>> {
  try {
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
      entities: [],
    };

    for (const file of files) {
      const source = await readFile(file, "utf8");
      const tree = parse(source);
      const parsed = buildMasterWalker(tree, file);

      analysis.files.push(parsed);
      analysis.symbols.push(...parsed.symbols);
      analysis.callGraph.push(...buildCallGraph(tree, file));

      const entities = extractEntities(tree, file);
      analysis.entities.push(...entities);
    }

    analysis.relationships = buildDependencyGraph(analysis);

    const program = createProgram(files);
    const decoratorComponents: Component[] = [];

    for (const source of program.getSourceFiles()) {
      if (!source.fileName.startsWith(root)) continue;
      decoratorComponents.push(...extractDecoratorComponents(source));
    }

    analysis.components = decoratorComponents;

    return ok(analysis);
  } catch (error) {
    return err(
      error instanceof Error
        ? error
        : new Error("Failed to analyze repository"),
    );
  }
}
