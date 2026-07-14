// src/index.ts
function formatDuration(ms) {
  return `${ms}ms`;
}
function printSection(title) {
  console.log();
  console.log("=".repeat(50));
  console.log(title);
  console.log("=".repeat(50));
}
export {
  formatDuration,
  printSection
};
