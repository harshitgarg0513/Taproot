import { ExplainResult } from "./explain.js";

export function formatExplain(result: ExplainResult) {
  console.log();
  console.log("===================================");
  console.log(result.component);
  console.log("===================================");
  console.log();
  console.log("Type:", result.type);
  console.log("File:", result.file);
  console.log();
  console.log("Symbols");
  console.log(result.symbols);
  console.log();
  console.log("Imports");
  console.log(result.imports);
  console.log();
  console.log("Calls");
  console.log(result.callees);
  console.log();
  console.log("Summary");
  console.log(result.summary);
}
