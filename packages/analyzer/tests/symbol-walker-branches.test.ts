import { describe, expect, it } from "vitest";
import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";
import { buildSymbolTable } from "../src/parser/symbolWalker";

const parser = new Parser();
parser.setLanguage(TypeScript.typescript);

describe("symbol walker branches", () => {
  it("covers the alternate symbol cases", () => {
    const tree = parser.parse(`
      class Demo {}
      function hello() {}
      interface User {}
      type Name = string;
      enum Status { A }
      const value = 1;
      import { x } from './x';
      export { value };
    `);

    const parsed = buildSymbolTable(tree, "src/demo.ts");

    expect(parsed.symbols.length).toBeGreaterThan(0);
  });
});
