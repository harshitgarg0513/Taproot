// src/analyzer.ts
import fg from "fast-glob";
import { readFile } from "fs/promises";

// src/graph/dependencyGraph.ts
import path from "path";
function buildDependencyGraph(analysis) {
  const relationships = [];
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
        type: "IMPORTS"
      });
    }
  }
  return relationships;
}

// src/parser/parser.ts
import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";
var parser = new Parser();
parser.setLanguage(TypeScript.typescript);
function parse(code) {
  return parser.parse(code);
}

// src/parser/masterWalker.ts
function add(output, kind, name, file, line) {
  output.symbols.push({
    id: `${file}:${line}:${kind}:${name}`,
    kind,
    name,
    file,
    line
  });
}
function buildMasterWalker(tree, file) {
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

// src/tsCompiler.ts
import ts from "typescript";
function createProgram(rootNames) {
  return ts.createProgram({
    rootNames,
    options: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      allowJs: false,
      skipLibCheck: true
    }
  });
}

// src/component/decoratorExtractor.ts
import ts2 from "typescript";
function hasDecorator(node, name) {
  const decorators = ts2.getDecorators(node);
  if (!decorators) return false;
  return decorators.some((decorator) => {
    const expression = decorator.expression;
    const target = ts2.isCallExpression(expression) ? expression.expression : expression;
    return target.getText() === name || target.getText().endsWith(`.${name}`);
  });
}
function extractDecoratorComponents(source) {
  const components = [];
  function visit(node) {
    if (ts2.isClassDeclaration(node) && node.name) {
      let type = "Unknown";
      if (hasDecorator(node, "Controller")) type = "Controller";
      else if (hasDecorator(node, "Injectable")) type = "Service";
      else if (hasDecorator(node, "Module")) type = "Module";
      else if (hasDecorator(node, "Entity")) type = "Entity";
      components.push({
        id: `${source.fileName}:${node.name.text}`,
        name: node.name.text,
        type,
        file: source.fileName,
        line: source.getLineAndCharacterOfPosition(node.pos).line + 1
      });
    }
    ts2.forEachChild(node, visit);
  }
  visit(source);
  return components;
}

// src/graph/callGraph.ts
function buildCallGraph(tree, file) {
  const calls = [];
  let currentFunction = "GLOBAL";
  function visit(node) {
    if (node.type === "function_declaration" || node.type === "method_definition") {
      const name = node.childForFieldName("name")?.text;
      if (name) {
        currentFunction = name;
      }
    }
    if (node.type === "call_expression") {
      const fn = node.childForFieldName("function");
      if (fn) {
        calls.push({
          caller: currentFunction,
          callee: fn.text,
          file
        });
      }
    }
    for (const child of node.children) {
      visit(child);
    }
  }
  visit(tree.rootNode);
  return calls;
}

// src/analyzer.ts
import { err, ok } from "@eip/shared";
async function analyzeRepository(root) {
  try {
    const files = await fg(["**/*.ts"], {
      cwd: root,
      absolute: true,
      ignore: ["**/node_modules/**", "**/dist/**"]
    });
    const analysis = {
      files: [],
      symbols: [],
      relationships: [],
      components: [],
      callGraph: []
    };
    for (const file of files) {
      const source = await readFile(file, "utf8");
      const tree = parse(source);
      const parsed = buildMasterWalker(tree, file);
      analysis.files.push(parsed);
      analysis.symbols.push(...parsed.symbols);
      analysis.callGraph.push(...buildCallGraph(tree, file));
    }
    analysis.relationships = buildDependencyGraph(analysis);
    const program = createProgram(files);
    const decoratorComponents = [];
    for (const source of program.getSourceFiles()) {
      if (!source.fileName.startsWith(root)) continue;
      decoratorComponents.push(...extractDecoratorComponents(source));
    }
    analysis.components = decoratorComponents;
    return ok(analysis);
  } catch (error) {
    return err(error instanceof Error ? error : new Error("Failed to analyze repository"));
  }
}
export {
  analyzeRepository
};
