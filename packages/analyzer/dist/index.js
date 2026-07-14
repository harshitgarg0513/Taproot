// src/analyzer.ts
import fg from "fast-glob";
import { readFile } from "fs/promises";

// src/component.ts
function extractComponents(analysis) {
  const components = [];
  for (const file of analysis.files) {
    for (const symbol of file.symbols) {
      if (symbol.kind !== "class") continue;
      let type = "Unknown";
      if (symbol.name.endsWith("Controller")) type = "Controller";
      else if (symbol.name.endsWith("Service")) type = "Service";
      else if (symbol.name.endsWith("Module")) type = "Module";
      else if (symbol.name.endsWith("Repository")) type = "Repository";
      else if (symbol.name.endsWith("Entity")) type = "Entity";
      components.push({
        id: symbol.id,
        name: symbol.name,
        type,
        file: symbol.file,
        line: symbol.line
      });
    }
  }
  return components;
}

// src/graph.ts
import path from "path";
function buildDependencyGraph(analysis) {
  const relationships = [];
  const projectFiles = new Set(analysis.files.map((file) => path.normalize(file.path)));
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
        type: "IMPORTS"
      });
    }
  }
  return relationships;
}

// src/parser.ts
import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";
var parser = new Parser();
parser.setLanguage(TypeScript.typescript);
function parse(code) {
  return parser.parse(code);
}

// src/symbolWalker.ts
function add(output, kind, name, file, line) {
  output.symbols.push({
    id: `${file}:${line}:${kind}:${name}`,
    kind,
    name,
    file,
    line
  });
}
function buildSymbolTable(tree, file) {
  const parsed = {
    path: file,
    symbols: []
  };
  function visit(node) {
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
    }
    for (const child of node.children) {
      visit(child);
    }
  }
  visit(tree.rootNode);
  return parsed;
}

// src/analyzer.ts
async function analyzeRepository(root) {
  const files = await fg(["**/*.ts"], {
    cwd: root,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"]
  });
  const analysis = {
    files: [],
    symbols: [],
    relationships: [],
    components: []
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
export {
  analyzeRepository
};
