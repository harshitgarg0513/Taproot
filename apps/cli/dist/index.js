#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/commands/components.ts
import { analyzeRepository } from "@eip/analyzer";
async function components(repo) {
  const analysis = await analyzeRepository(repo);
  console.log();
  console.log("Components");
  console.log("-------------------------");
  for (const component of analysis.components) {
    console.log(`[${component.type}]`, component.name);
  }
  console.log();
}

// src/commands/graph.ts
import { analyzeRepository as analyzeRepository2 } from "@eip/analyzer";
async function graph(repo) {
  const analysis = await analyzeRepository2(repo);
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
import { analyzeRepository as analyzeRepository3 } from "@eip/analyzer";
import { observeRepository } from "@eip/observer";
import { formatDuration } from "@eip/shared";
async function inspect(path) {
  const snapshot = await observeRepository(path);
  const analysis = await analyzeRepository3(path);
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
program.parse();
