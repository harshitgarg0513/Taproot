import { describe, expect, it } from "vitest";
import { createProgram } from "../src/tsCompiler";
import { buildSymbolTable } from "../src/parser/symbolWalker";
import { buildCallGraph } from "../src/graph/callGraph";
import { buildDependencyGraph } from "../src/graph/dependencyGraph";
import { extractDecoratorComponents } from "../src/component/decoratorExtractor";
import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

const parser = new Parser();
parser.setLanguage(TypeScript.typescript);

describe("analyzer helpers", () => {
  it("creates a TypeScript program", () => {
    const program = createProgram(["packages/core/src/builder.ts"]);

    expect(program.getSourceFiles().length).toBeGreaterThan(0);
  });

  it("builds a symbol table", () => {
    const tree = parser.parse("function hello() {}\nclass Demo {}\n");
    const parsed = buildSymbolTable(tree, "src/demo.ts");

    expect(parsed.symbols.length).toBeGreaterThan(0);
  });

  it("builds a call graph", () => {
    const tree = parser.parse("function a() { b(); }\nfunction b() {}\n");
    const calls = buildCallGraph(tree, "src/demo.ts");

    expect(calls).toHaveLength(1);
  });

  it("builds dependency graph", () => {
    const analysis = {
      files: [
        { path: "src/a.ts", symbols: [{ kind: "import", name: "import x from './b'" }] },
        { path: "src/b.ts", symbols: [] },
      ],
      symbols: [],
      relationships: [],
      components: [],
      callGraph: [],
    } as any;

    const relationships = buildDependencyGraph(analysis);

    expect(relationships).toHaveLength(1);
  });

  it("extracts decorator components", () => {
    const source = createProgram(["packages/core/src/builder.ts"]).getSourceFile("packages/core/src/builder.ts");

    expect(source).toBeTruthy();

    if (!source) return;

    const components = extractDecoratorComponents(source);
    expect(components).toBeDefined();
  });
});
