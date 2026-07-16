#!/usr/bin/env node

import { Command } from "commander";
import { calls } from "./commands/calls.js";
import { components } from "./commands/components.js";
import { graph } from "./commands/graph.js";
import { inspect } from "./commands/inspect.js";
import { query } from "./commands/query.js";
import { model } from "./commands/model.js";
import { knowledge } from "./commands/knowledge.js";
import { impact } from "./commands/impact.js";
import { search } from "./commands/search.js";
import { cache } from "./commands/cache.js";
import { benchmark } from "./commands/benchmark.js";
import { classify } from "./commands/classify.js";
import { config as configCommand } from "./commands/config.js";
import { entities } from "./commands/entities.js";
import { explainCommand } from "./commands/explain.js";
import { risk } from "./commands/risk.js";
import { retrieval } from "./commands/retrieve.js";
import { context as contextCommand } from "./commands/context.js";
import { evaluate as evaluateCommand } from "./commands/evaluate.js";

const program = new Command();

program.name("eip");
program.version("0.0.1");

program
  .command("inspect")
  .argument("[path]", ".", "Repository Path")
  .action((targetPath: string) => {
    void inspect(targetPath);
  });

program
  .command("scan")
  .argument("[path]", ".", "Repository Path")
  .description("Alias for inspect")
  .action((targetPath: string) => {
    void inspect(targetPath);
  });

program
  .command("graph")
  .argument("[path]", ".", "Repository")
  .action((targetPath: string) => {
    void graph(targetPath);
  });

program
  .command("components")
  .argument("[path]", ".")
  .action((targetPath: string) => {
    void components(targetPath);
  });

program
  .command("calls")
  .argument("[path]", ".")
  .action((targetPath: string) => {
    void calls(targetPath);
  });

program
  .command("query")
  .argument("<repo>")
  .argument("<type>")
  .argument("<value>")
  .action((repo: string, type: string, value: string) => {
    void query(repo, type, value);
  });

program.command("model").argument("[path]", ".").action(model);

program
  .command("knowledge")
  .argument("[path]", ".")
  .action((targetPath: string) => {
    void knowledge(targetPath);
  });

program
  .command("impact")
  .argument("<repo>")
  .argument("<file>")
  .action((repo: string, file: string) => {
    void impact(repo, file);
  });

program
  .command("search")
  .argument("<repo>")
  .argument("<query>")
  .action((repo: string, query: string) => {
    void search(repo, query);
  });

program
  .command("cache")
  .argument("<action>")
  .action((action: string) => {
    void cache(action);
  });

program
  .command("benchmark")
  .argument("[path]", ".")
  .action((targetPath: string) => {
    void benchmark(targetPath);
  });

program
  .command("config")
  .argument("[path]", ".")
  .action((targetPath: string) => {
    void configCommand(targetPath);
  });

program
  .command("entities")
  .argument("[path]", ".")
  .action((targetPath: string) => {
    void entities(targetPath);
  });

program
  .command("classify")
  .argument("[path]", ".")
  .action((targetPath: string) => {
    void classify(targetPath);
  });

program
  .command("explain")
  .argument("<repo>")
  .argument("<component>")
  .action((repo: string, component: string) => {
    void explainCommand(repo, component);
  });

program
  .command("risk")
  .argument("<repo>")
  .argument("<target>")
  .action((repo: string, target: string) => {
    void risk(repo, target);
  });

program
  .command("retrieve")
  .argument("<repo>")
  .argument("<query>")
  .action((repo: string, query: string) => {
    void retrieval(repo, query);
  });

program
  .command("context")
  .argument("<repo>")
  .argument("<query>")
  .action((repo: string, query: string) => {
    void contextCommand(repo, query);
  });

program
  .command("evaluate")
  .argument("<repo>")
  .action((repo: string) => {
    void evaluateCommand(repo);
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