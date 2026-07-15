export * from "./result.js";
export * from "./errors.js";
export * from "./matcher.js";
export function formatDuration(ms) {
    return `${ms}ms`;
}
export function printSection(title) {
    console.log();
    console.log("=".repeat(50));
    console.log(title);
    console.log("=".repeat(50));
}
