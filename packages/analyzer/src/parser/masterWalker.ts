import Parser from "tree-sitter";

import { ParsedFile, SymbolNode } from "../types.js";

function add(output: ParsedFile, kind: SymbolNode["kind"], name: string, file: string, line: number) {
  output.symbols.push({
    id: `${file}:${line}:${kind}:${name}`,
    kind,
    name,
    file,
    line,
  });
}

export function buildMasterWalker(tree: Parser.Tree, file: string): ParsedFile {
  const parsed: ParsedFile = {
    path: file,
    symbols: [],
  };

  function visit(node: Parser.SyntaxNode) {
    switch (node.type) {
      case "class_declaration":
        add(parsed, "class", node.childForFieldName("name")?.text ?? "Anonymous", file, node.startPosition.row + 1);
        break;

      case "function_declaration":
        add(parsed, "function", node.childForFieldName("name")?.text ?? "anonymous", file, node.startPosition.row + 1);
        break;

      case "method_definition":
        add(parsed, "method", node.childForFieldName("name")?.text ?? "anonymous", file, node.startPosition.row + 1);
        break;

      case "interface_declaration":
        add(parsed, "interface", node.childForFieldName("name")?.text ?? "anonymous", file, node.startPosition.row + 1);
        break;

      case "type_alias_declaration":
        add(parsed, "type", node.childForFieldName("name")?.text ?? "anonymous", file, node.startPosition.row + 1);
        break;

      case "enum_declaration":
        add(parsed, "enum", node.childForFieldName("name")?.text ?? "anonymous", file, node.startPosition.row + 1);
        break;

      case "lexical_declaration":
      case "variable_declaration":
        add(parsed, "variable", node.text.substring(0, 40), file, node.startPosition.row + 1);
        break;

      case "import_statement":
        add(parsed, "import", node.text, file, node.startPosition.row + 1);
        break;

      case "export_statement":
        add(parsed, "export", node.text, file, node.startPosition.row + 1);
        break;

      case "call_expression": {
        const fn = node.childForFieldName("function");
        if (fn) {
          add(parsed, "function", fn.text, file, node.startPosition.row + 1);
        }
        break;
      }
    }

    for (const child of node.children) {
      visit(child);
    }
  }

  visit(tree.rootNode);

  return parsed;
}
