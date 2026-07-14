import path from "node:path";

import { Relationship, RepositoryAnalysis } from "../types.js";

export function buildDependencyGraph(analysis: RepositoryAnalysis): Relationship[] {
  const relationships: Relationship[] = [];

  const projectFiles = new Set(
    analysis.files.map((file) => path.normalize(path.resolve(file.path)))
  );

  for (const file of analysis.files) {
    const imports = file.symbols.filter((symbol) => symbol.kind === "import");

    for (const imp of imports) {
      const match = imp.name.match(/from\s+['"](.+)['"]/);

      if (!match) continue;

      const specifier = match[1];

      if (!specifier.startsWith(".")) continue;

      const absolute = path.normalize(path.resolve(path.dirname(file.path), specifier + ".ts"));

      if (!projectFiles.has(absolute)) continue;

      relationships.push({
        from: file.path,
        to: absolute,
        type: "IMPORTS",
      });
    }
  }

  return relationships;
}
