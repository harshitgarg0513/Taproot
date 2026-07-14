export * from "./result.js";
export * from "./errors.js";

export function formatDuration(ms: number): string {
  return `${ms}ms`;
}

export function printSection(title: string) {
  console.log();
  console.log("=".repeat(50));
  console.log(title);
  console.log("=".repeat(50));
}
