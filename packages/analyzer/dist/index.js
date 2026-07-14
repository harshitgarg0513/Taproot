// src/analyzer.ts
import fg from "fast-glob";
import { readFile } from "fs/promises";

// src/parser.ts
import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";
var parser = new Parser();
parser.setLanguage(TypeScript.typescript);
function parse(code) {
  return parser.parse(code);
}

// src/walker.ts
function walkTree(tree, path) {
  const output = {
    path,
    functions: [],
    classes: [],
    imports: []
  };
  function visit(node) {
    switch (node.type) {
      case "function_declaration":
        output.functions.push({
          name: node.childForFieldName("name")?.text ?? "anonymous",
          line: node.startPosition.row + 1
        });
        break;
      case "class_declaration":
        output.classes.push({
          name: node.childForFieldName("name")?.text ?? "Anonymous",
          line: node.startPosition.row + 1
        });
        break;
      case "import_statement":
        output.imports.push({
          module: node.text
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

// src/analyzer.ts
async function analyzeRepository(root) {
  const files = await fg(["**/*.ts"], {
    cwd: root,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"]
  });
  const result = {
    files: []
  };
  for (const file of files) {
    const code = await readFile(file, "utf8");
    const tree = parse(code);
    result.files.push(walkTree(tree, file));
  }
  return result;
}
export {
  analyzeRepository
};
