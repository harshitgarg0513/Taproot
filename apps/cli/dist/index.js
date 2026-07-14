#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/commands/inspect.ts
import pc from "picocolors";
import { observeRepository } from "@eip/observer";
import { formatDuration } from "@eip/shared";
async function inspect(path) {
  const snapshot = await observeRepository(path);
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
