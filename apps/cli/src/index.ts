#!/usr/bin/env node

import { Command } from "commander";
import { calls } from "./commands/calls";
import { components } from "./commands/components";
import { graph } from "./commands/graph";
import { inspect } from "./commands/inspect";
import { query } from "./commands/query";
import { model } from "./commands/model";
import { knowledge } from "./commands/knowledge";
import { impact } from "./commands/impact";
import { search } from "./commands/search";
import { cache } from "./commands/cache";
import { benchmark } from "./commands/benchmark";
import { classify } from "./commands/classify";
import { config as configCommand } from "./commands/config.js";
import { entities } from "./commands/entities";
import { explainCommand } from "./commands/explain.js";

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

program.parse();
