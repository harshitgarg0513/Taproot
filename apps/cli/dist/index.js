#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/commands/calls.ts
import { analyzeRepository } from "@eip/analyzer";
async function calls(repo) {
  const analysisResult = await analyzeRepository(repo);
  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }
  const analysis = analysisResult.data;
  console.log();
  console.log("Call Graph");
  console.log("----------------------");
  for (const edge of analysis.callGraph) {
    console.log(edge.caller, "->", edge.callee);
  }
}

// src/commands/components.ts
import { analyzeRepository as analyzeRepository2 } from "@eip/analyzer";
async function components(repo) {
  const analysisResult = await analyzeRepository2(repo);
  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }
  const analysis = analysisResult.data;
  console.log();
  console.log("Components");
  console.log("-------------------------");
  for (const component of analysis.components) {
    console.log(`${component.type.padEnd(15)}`, component.name.padEnd(30), `(${component.file.split("/").pop()})`);
  }
  console.log();
}

// src/commands/graph.ts
import { analyzeRepository as analyzeRepository3 } from "@eip/analyzer";
async function graph(repo) {
  const analysisResult = await analyzeRepository3(repo);
  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }
  const analysis = analysisResult.data;
  console.log();
  console.log("Dependency Graph");
  console.log("-------------------------");
  for (const edge of analysis.relationships) {
    console.log(edge.from, " --> ", edge.to);
  }
  console.log();
}

// src/commands/inspect.ts
import pc from "picocolors";
import { analyzeRepository as analyzeRepository4 } from "@eip/analyzer";
import { observeRepository } from "@eip/observer";
import { formatDuration } from "@eip/shared";
async function inspect(path) {
  const snapshotResult = await observeRepository(path);
  if (!snapshotResult.success) {
    console.error(snapshotResult.error.message);
    process.exit(1);
  }
  const analysisResult = await analyzeRepository4(path);
  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }
  const snapshot = snapshotResult.data;
  const analysis = analysisResult.data;
  console.log();
  console.log(pc.cyan("Engineering Intelligence Platform"));
  console.log("--------------------------------------");
  console.log("Repository       :", snapshot.name);
  console.log("Path             :", snapshot.rootPath);
  console.log("Languages        :", snapshot.languages.join(", "));
  console.log("Framework        :", snapshot.framework ?? "-");
  console.log("Package Manager  :", snapshot.packageManager ?? "-");
  console.log("Git              :", snapshot.hasGit ? "Yes" : "No");
  console.log("Files            :", snapshot.totalFiles);
  console.log("Directories      :", snapshot.totalDirectories);
  const classes = analysis.symbols.filter((s) => s.kind === "class").length;
  const functions = analysis.symbols.filter((s) => s.kind === "function").length;
  const methods = analysis.symbols.filter((s) => s.kind === "method").length;
  const interfaces = analysis.symbols.filter((s) => s.kind === "interface").length;
  const types = analysis.symbols.filter((s) => s.kind === "type").length;
  const enums = analysis.symbols.filter((s) => s.kind === "enum").length;
  const imports = analysis.symbols.filter((s) => s.kind === "import").length;
  const exportsCount = analysis.symbols.filter((s) => s.kind === "export").length;
  console.log("TS Files         :", analysis.files.length);
  console.log("Symbols          :", analysis.symbols.length);
  console.log("Classes          :", classes);
  console.log("Interfaces       :", interfaces);
  console.log("Enums            :", enums);
  console.log("Types            :", types);
  console.log("Functions        :", functions);
  console.log("Methods          :", methods);
  console.log("Imports          :", imports);
  console.log("Exports          :", exportsCount);
  console.log("Relationships    :", analysis.relationships.length);
  console.log("Function Calls   :", analysis.callGraph.length);
  const controllerCount = analysis.components.filter((component) => component.type === "Controller").length;
  const serviceCount = analysis.components.filter((component) => component.type === "Service").length;
  const moduleCount = analysis.components.filter((component) => component.type === "Module").length;
  const repositoryCount = analysis.components.filter((component) => component.type === "Repository").length;
  const entityCount = analysis.components.filter((component) => component.type === "Entity").length;
  console.log("Components       :", analysis.components.length);
  console.log("Controllers      :", controllerCount);
  console.log("Services         :", serviceCount);
  console.log("Modules          :", moduleCount);
  console.log("Repositories     :", repositoryCount);
  console.log("Entities         :", entityCount);
  console.log("Scan Time        :", formatDuration(snapshot.scanDurationMs));
  console.log();
}

// src/commands/query.ts
import { buildRepositoryModel, findComponent, findSymbol } from "@eip/core";
async function query(repo, type, value) {
  const modelResult = await buildRepositoryModel(repo);
  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }
  const model2 = modelResult.data;
  switch (type) {
    case "component": {
      const component = findComponent(model2, value);
      console.log(component ?? `No component named "${value}" found.`);
      break;
    }
    case "symbol": {
      const symbols = findSymbol(model2, value);
      console.log(symbols.length > 0 ? symbols : `No symbol named "${value}" found.`);
      break;
    }
    default:
      console.log("Unknown query.");
  }
}

// src/commands/model.ts
import { buildRepositoryModel as buildRepositoryModel2 } from "@eip/core";
async function model(path) {
  const modelResult = await buildRepositoryModel2(path);
  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }
  console.log(JSON.stringify(modelResult.data, null, 2));
}

// src/commands/knowledge.ts
import { buildKnowledge } from "@eip/core";
async function knowledge(repo) {
  const graphResult = await buildKnowledge(repo);
  if (!graphResult.success) {
    console.error(graphResult.error.message);
    process.exit(1);
  }
  const graph2 = graphResult.data;
  console.log();
  console.log("Knowledge Graph");
  console.log("----------------");
  console.log("Nodes :", graph2.nodes.length);
  console.log("Edges :", graph2.edges.length);
}

// src/commands/impact.ts
import { buildRepositoryModel as buildRepositoryModel3, analyzeImpact } from "@eip/core";
async function impact(repo, file) {
  const modelResult = await buildRepositoryModel3(repo);
  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }
  const result = analyzeImpact(modelResult.data, file);
  if (!result.success) {
    console.error(result.error.message);
    process.exit(1);
  }
  console.log();
  console.log("Impact Analysis");
  console.log("-----------------------");
  console.log();
  console.log("Changed File:");
  console.log(result.data.changedFile);
  console.log();
  console.log("Impacted Files");
  console.log("----------------");
  for (const impactedFile of result.data.impactedFiles) {
    console.log(impactedFile);
  }
  console.log();
  console.log("Impacted Components");
  console.log("----------------");
  for (const component of result.data.impactedComponents) {
    console.log(component);
  }
  console.log();
  console.log("Impacted Symbols");
  console.log("----------------");
  for (const symbol of result.data.impactedSymbols) {
    console.log(symbol);
  }
}

// src/commands/search.ts
import { buildRepositoryModel as buildRepositoryModel4, searchRepository } from "@eip/core";
async function search(repo, query2) {
  const modelResult = await buildRepositoryModel4(repo);
  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }
  const result = searchRepository(modelResult.data, query2);
  if (!result.success) {
    console.error(result.error.message);
    process.exit(1);
  }
  console.log();
  console.log("Search");
  console.log("----------------");
  console.log();
  console.log("Components");
  console.log();
  for (const component of result.data.components) {
    console.log(component.type.padEnd(15), component.name);
  }
  console.log();
  console.log("Symbols");
  console.log();
  for (const symbol of result.data.symbols) {
    console.log(symbol.kind.padEnd(15), symbol.name);
  }
  console.log();
  console.log("Files");
  console.log();
  for (const file of result.data.files) {
    console.log(file);
  }
}

// src/index.ts
var program = new Command();
program.name("eip");
program.version("0.0.1");
program.command("inspect").argument("[path]", ".", "Repository Path").action((targetPath) => {
  void inspect(targetPath);
});
program.command("graph").argument("[path]", ".", "Repository").action((targetPath) => {
  void graph(targetPath);
});
program.command("components").argument("[path]", ".").action((targetPath) => {
  void components(targetPath);
});
program.command("calls").argument("[path]", ".").action((targetPath) => {
  void calls(targetPath);
});
program.command("query").argument("<repo>").argument("<type>").argument("<value>").action((repo, type, value) => {
  void query(repo, type, value);
});
program.command("model").argument("[path]", ".").action(model);
program.command("knowledge").argument("[path]", ".").action((targetPath) => {
  void knowledge(targetPath);
});
program.command("impact").argument("<repo>").argument("<file>").action((repo, file) => {
  void impact(repo, file);
});
program.command("search").argument("<repo>").argument("<query>").action((repo, query2) => {
  void search(repo, query2);
});
program.parse();
