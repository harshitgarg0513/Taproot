import Parser from "tree-sitter";
import { ParsedFile } from "./types.js";

export function walkTree(tree: Parser.Tree, path: string): ParsedFile {
  const output: ParsedFile = {
    path,
    functions: [],
    classes: [],
    imports: [],
  };

  function visit(node: Parser.SyntaxNode) {
    switch (node.type) {
      case "function_declaration":
        output.functions.push({
          name: node.childForFieldName("name")?.text ?? "anonymous",
          line: node.startPosition.row + 1,
        });
        break;

      case "class_declaration":
        output.classes.push({
          name: node.childForFieldName("name")?.text ?? "Anonymous",
          line: node.startPosition.row + 1,
        });
        break;

      case "import_statement":
        output.imports.push({
          module: node.text,
        });
        break;
    }

    for (const child of node.children) {
      visit(child);
    }
  }

  visit(tree.rootNode);

  return output;
}
