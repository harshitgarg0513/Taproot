import { describe, expect, it } from "vitest";
import { createProgram } from "../src/tsCompiler";
import ts from "typescript";

describe("branch coverage helpers", () => {
  it("exercises the ts compiler and parser branches", () => {
    const program = createProgram(["packages/core/src/builder.ts"]);
    const source = program.getSourceFile("packages/core/src/builder.ts");

    expect(source).toBeTruthy();
    if (source) {
      const node = source.statements[0];
      expect(node.kind).toBe(ts.SyntaxKind.ImportDeclaration);
    }
  });
});
