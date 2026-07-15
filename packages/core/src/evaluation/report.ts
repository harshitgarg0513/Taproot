import type { Metrics } from "./metrics.js";

export function printReport(results: Metrics[]) {
  const avg = (key: keyof Metrics) =>
    results.reduce((sum, item) => sum + item[key], 0) / results.length;

  console.log();
  console.log("================================");
  console.log("Evaluation");
  console.log("================================");
  console.log();
  console.table({
    Precision: avg("precision"),
    Recall: avg("recall"),
    F1: avg("f1"),
  });
}
