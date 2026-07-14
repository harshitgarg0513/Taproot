import { Component } from "./types";

export function extractComponents(analysis: any): Component[] {
  const components: Component[] = [];

  for (const file of analysis.files) {
    for (const symbol of file.symbols) {
      if (symbol.kind !== "class") continue;

      let type: Component["type"] = "Unknown";

      if (symbol.name.endsWith("Controller")) type = "Controller";
      else if (symbol.name.endsWith("Service")) type = "Service";
      else if (symbol.name.endsWith("Module")) type = "Module";
      else if (symbol.name.endsWith("Repository")) type = "Repository";
      else if (symbol.name.endsWith("Entity")) type = "Entity";

      components.push({
        id: symbol.id,
        name: symbol.name,
        type,
        file: symbol.file,
        line: symbol.line,
      });
    }
  }

  return components;
}
