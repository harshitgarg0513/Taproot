#!/usr/bin/env node

import { Command } from "commander";
import { components } from "./commands/components";
import { graph } from "./commands/graph";
import { inspect } from "./commands/inspect";

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

program.parse();
