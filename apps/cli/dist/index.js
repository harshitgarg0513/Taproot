#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/commands/inspect.ts
import pc from "picocolors";
import { analyzeRepository } from "@eip/analyzer";
import { observeRepository } from "@eip/observer";
import { formatDuration } from "@eip/shared";
async function inspect(path) {
  const snapshot = await observeRepository(path);
  const analysis = await analyzeRepository(path);
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
  const functionCount = analysis.files.reduce((a, b) => a + b.functions.length, 0);
  const classCount = analysis.files.reduce((a, b) => a + b.classes.length, 0);
  const importCount = analysis.files.reduce((a, b) => a + b.imports.length, 0);
  console.log("TS Files         :", analysis.files.length);
  console.log("Classes          :", classCount);
  console.log("Functions        :", functionCount);
  console.log("Imports          :", importCount);
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
program.parse();
