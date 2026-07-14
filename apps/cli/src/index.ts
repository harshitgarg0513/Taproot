#!/usr/bin/env node

import { Command } from "commander";
import { calls } from "./commands/calls";
import { components } from "./commands/components";
import { graph } from "./commands/graph";
import { inspect } from "./commands/inspect";
import { query } from "./commands/query";

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

program.parse();
