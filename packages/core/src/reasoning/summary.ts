import { ExplainResult } from "./explain.js";

export function buildSummary(result: ExplainResult) {
  return `${result.component} is a ${result.type} defined in ${result.file}. It contains ${result.symbols.length} symbols, imports ${result.imports.length} modules and directly invokes ${result.callees.length} functions.`;
}
