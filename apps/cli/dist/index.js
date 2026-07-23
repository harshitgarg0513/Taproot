#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/commands/calls.ts
import { analyzeRepository } from "@taproot/analyzer";
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
import { analyzeRepository as analyzeRepository2 } from "@taproot/analyzer";
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
    console.log(
      `${component.type.padEnd(15)}`,
      component.name.padEnd(30),
      `(${component.file.split("/").pop()})`
    );
  }
  console.log();
}

// src/commands/graph.ts
import { analyzeRepository as analyzeRepository3 } from "@taproot/analyzer";
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
import { analyzeRepository as analyzeRepository4 } from "@taproot/analyzer";
import { observeRepository } from "@taproot/observer";
import { formatDuration } from "@taproot/shared";
async function inspect(path) {
  let snapshotResult;
  let analysisResult;
  console.log("[inspect] observing repository");
  try {
    snapshotResult = await observeRepository(path);
  } catch (error) {
    console.error("Failed during repository observation:");
    console.error(error);
    process.exit(1);
  }
  console.log("[inspect] observation complete");
  if (!snapshotResult.success) {
    console.error(snapshotResult.error.message);
    process.exit(1);
  }
  console.log("[inspect] analyzing repository");
  try {
    analysisResult = await analyzeRepository4(path);
  } catch (error) {
    console.error("Failed during repository analysis:");
    console.error(error);
    process.exit(1);
  }
  console.log("[inspect] analysis complete");
  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }
  try {
    console.log("[inspect] assigning snapshot and analysis");
    const snapshot = snapshotResult.data;
    console.log("[inspect] snapshot assigned");
    const analysis = analysisResult.data;
    console.log("[inspect] analysis assigned");
    console.log("[inspect] rendering report");
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
    const functions = analysis.symbols.filter(
      (s) => s.kind === "function"
    ).length;
    const methods = analysis.symbols.filter((s) => s.kind === "method").length;
    const interfaces = analysis.symbols.filter(
      (s) => s.kind === "interface"
    ).length;
    const types = analysis.symbols.filter((s) => s.kind === "type").length;
    const enums = analysis.symbols.filter((s) => s.kind === "enum").length;
    const imports = analysis.symbols.filter((s) => s.kind === "import").length;
    const exportsCount = analysis.symbols.filter(
      (s) => s.kind === "export"
    ).length;
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
    const controllerCount = analysis.components.filter(
      (component) => component.type === "Controller"
    ).length;
    const serviceCount = analysis.components.filter(
      (component) => component.type === "Service"
    ).length;
    const moduleCount = analysis.components.filter(
      (component) => component.type === "Module"
    ).length;
    const repositoryCount = analysis.components.filter(
      (component) => component.type === "Repository"
    ).length;
    const entityCount = analysis.components.filter(
      (component) => component.type === "Entity"
    ).length;
    console.log("Components       :", analysis.components.length);
    console.log("Controllers      :", controllerCount);
    console.log("Services         :", serviceCount);
    console.log("Modules          :", moduleCount);
    console.log("Repositories     :", repositoryCount);
    console.log("Entities         :", entityCount);
    console.log("Scan Time        :", formatDuration(snapshot.scanDurationMs));
    console.log();
  } catch (error) {
    console.error("[inspect] report rendering failed");
    console.error(error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    throw error;
  }
}

// src/commands/query.ts
import { buildRepositoryModel, findComponent, findSymbol } from "@taproot/core";
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
      console.log(
        symbols.length > 0 ? symbols : `No symbol named "${value}" found.`
      );
      break;
    }
    default:
      console.log("Unknown query.");
  }
}

// src/commands/model.ts
import { buildRepositoryModel as buildRepositoryModel2 } from "@taproot/core";
async function model(path) {
  const modelResult = await buildRepositoryModel2(path);
  if (!modelResult.success) {
    console.error(modelResult.error.message);
    process.exit(1);
  }
  console.log(JSON.stringify(modelResult.data, null, 2));
}

// src/commands/knowledge.ts
import { buildKnowledge } from "@taproot/core";
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
import { buildRepositoryModel as buildRepositoryModel3, analyzeImpact } from "@taproot/core";
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
import { buildRepositoryModel as buildRepositoryModel4, searchRepository } from "@taproot/core";
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

// src/commands/cache.ts
import { cacheSize, clearCache } from "@taproot/core";
async function cache(action) {
  switch (action) {
    case "size":
      console.log("Cache Entries:", cacheSize());
      break;
    case "clear":
      clearCache();
      console.log("Cache cleared.");
      break;
    default:
      console.log("Unknown action.");
  }
}

// src/commands/benchmark.ts
import { buildRepositoryModel as buildRepositoryModel5 } from "@taproot/core";
async function benchmark(repo) {
  const start = performance.now();
  const result = await buildRepositoryModel5(repo);
  const total = performance.now() - start;
  if (!result.success) {
    console.error(result.error);
    return;
  }
  const m = result.data.metrics;
  console.log();
  console.log("Benchmark");
  console.log("----------------");
  console.log();
  console.log("Observer :", m.observerMs.toFixed(2), "ms");
  console.log("Analyzer :", m.analyzerMs.toFixed(2), "ms");
  console.log("Graph :", m.graphMs.toFixed(2), "ms");
  console.log("Total :", total.toFixed(2), "ms");
}

// src/commands/classify.ts
import { buildRepositoryModel as buildRepositoryModel6 } from "@taproot/core";
async function classify(repo) {
  const result = await buildRepositoryModel6(repo);
  if (!result.success) {
    console.error(result.error);
    return;
  }
  for (const entity of result.data.classified) {
    console.log();
    console.log(entity.entity.name);
    console.table(entity.labels);
  }
}

// src/commands/config.ts
import { loadConfig } from "@taproot/config";
async function config(repo) {
  const cfg = await loadConfig(repo);
  console.log(JSON.stringify(cfg, null, 2));
}

// src/commands/entities.ts
import { buildRepositoryModel as buildRepositoryModel7 } from "@taproot/core";
async function entities(repo) {
  const result = await buildRepositoryModel7(repo);
  if (!result.success) {
    console.error(result.error);
    return;
  }
  console.table(result.data.entities);
}

// src/commands/explain.ts
import { buildRepositoryModel as buildRepositoryModel8, explain, printExplain } from "@taproot/core";
async function explainCommand(repo, entity) {
  const result = await buildRepositoryModel8(repo);
  if (!result.success) {
    console.error(result.error);
    return;
  }
  const explanation = explain(result.data, entity);
  if (!explanation) {
    console.log("Entity not found.");
    return;
  }
  printExplain(explanation);
}

// src/commands/risk.ts
import { analyzeRisk, buildRepositoryModel as buildRepositoryModel9, printRisk } from "@taproot/core";
async function risk(repo, target) {
  const result = await buildRepositoryModel9(repo);
  if (!result.success) {
    console.error(result.error);
    return;
  }
  const analysis = analyzeRisk(result.data, target);
  printRisk(analysis);
}

// src/commands/retrieve.ts
import { buildRepositoryModel as buildRepositoryModel10, retrieve } from "@taproot/core";
async function retrieval(repo, query2) {
  const result = await buildRepositoryModel10(repo);
  if (!result.success) {
    console.error(result.error);
    return;
  }
  const retrievalResult = retrieve(result.data, query2);
  console.log();
  console.log("================================");
  console.log("Seed Retrieval");
  console.log("================================");
  console.log();
  console.log("Tokens", retrievalResult.tokens);
  console.log();
  console.table(retrievalResult.ranked);
  console.log();
  console.log("Expanded Nodes", retrievalResult.expanded.size);
}

// src/commands/context.ts
import { buildRepositoryModel as buildRepositoryModel11, generate } from "@taproot/core";
async function context(repo, query2) {
  const repoResult = await buildRepositoryModel11(repo);
  if (!repoResult.success) {
    console.error(repoResult.error);
    return;
  }
  const contextPackage = await generate(repoResult.data, query2, repo);
  console.log("================================");
  console.log("Confidence");
  console.log(contextPackage.context.confidence.level);
  console.log(`${Math.round(contextPackage.context.confidence.score)}%`);
  console.log(contextPackage.context.confidence.reason);
  if (contextPackage.context.confidence.suggestions.length > 0) {
    console.log("Suggestions");
    for (const suggestion of contextPackage.context.confidence.suggestions) {
      console.log(`\u2022 ${suggestion}`);
    }
  }
  console.log("================================");
  if (!contextPackage.context.success) {
    return;
  }
  console.log(contextPackage.context.prompt);
  console.log();
  console.log("================================");
  console.log("Context Package");
  console.log("================================");
  console.log();
  console.log("Selected Files");
  console.table(
    contextPackage.context.budget.map((item) => ({
      file: item.path,
      score: item.score,
      reasons: item.reasons.join(", ")
    }))
  );
  console.log();
  console.log("Prompt");
  console.log(contextPackage.context.prompt);
  console.log();
  console.log("Prompt Tokens");
  console.log(contextPackage.context.promptTokens);
  console.log();
  console.log("Answer");
  const generationError = "error" in contextPackage ? contextPackage.error : void 0;
  if (generationError) {
    console.error("Generation failed:", generationError.message);
    return;
  }
  console.log(contextPackage.generation?.text ?? contextPackage.answer);
}

// src/commands/evaluate.ts
import {
  buildRepositoryModel as buildRepositoryModel12,
  evaluateCommit,
  getChangedFiles,
  getCommitHistory,
  printReport,
  shouldEvaluate
} from "@taproot/core";
async function evaluate(repo) {
  const result = await buildRepositoryModel12(repo);
  if (!result.success) {
    console.error(result.error);
    return;
  }
  const history = getCommitHistory(repo);
  const results = [];
  for (const commit of history) {
    const files = getChangedFiles(repo, commit.hash);
    if (!shouldEvaluate(commit.message, files)) {
      continue;
    }
    results.push(evaluateCommit(result.data, commit.message, files, repo));
  }
  printReport(results);
}

// src/index.ts
var program = new Command();
program.name("taproot");
program.version("0.0.1");
program.command("inspect").argument("[path]", ".", "Repository Path").action((targetPath) => {
  void inspect(targetPath);
});
program.command("scan").argument("[path]", ".", "Repository Path").description("Alias for inspect").action((targetPath) => {
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
program.command("cache").argument("<action>").action((action) => {
  void cache(action);
});
program.command("benchmark").argument("[path]", ".").action((targetPath) => {
  void benchmark(targetPath);
});
program.command("config").argument("[path]", ".").action((targetPath) => {
  void config(targetPath);
});
program.command("entities").argument("[path]", ".").action((targetPath) => {
  void entities(targetPath);
});
program.command("classify").argument("[path]", ".").action((targetPath) => {
  void classify(targetPath);
});
program.command("explain").argument("<repo>").argument("<component>").action((repo, component) => {
  void explainCommand(repo, component);
});
program.command("risk").argument("<repo>").argument("<target>").action((repo, target) => {
  void risk(repo, target);
});
program.command("retrieve").argument("<repo>").argument("<query>").action((repo, query2) => {
  void retrieval(repo, query2);
});
program.command("context").argument("<repo>").argument("<query>").action((repo, query2) => {
  void context(repo, query2);
});
program.command("evaluate").argument("<repo>").action((repo) => {
  void evaluate(repo);
});
(async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error("===== FULL ERROR =====");
    if (error instanceof Error) {
      console.error(error.stack ?? error.message);
    } else {
      console.error(error);
    }
    console.error("======================");
    process.exitCode = 1;
  }
})();
