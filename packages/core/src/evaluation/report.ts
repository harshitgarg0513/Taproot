import type { Metrics } from "./metrics.js";

function formatMetric(value: number) {
  return value.toFixed(2);
}

export function printReport(results: Metrics[]) {
  const avg = (key: keyof Metrics) => {
    if (results.length === 0) {
      return 0;
    }

    return results.reduce((sum, item) => sum + item[key], 0) / results.length;
  };

  console.log();
  console.log("================================");
  console.log("Evaluation");
  console.log("================================");
  console.log();
  console.log("Commits Evaluated");
  console.log(results.length);
  console.log();
  console.log("Precision");
  console.log(formatMetric(avg("precision")));
  console.log();
  console.log("Recall");
  console.log(formatMetric(avg("recall")));
  console.log();
  console.log("F1");
  console.log(formatMetric(avg("f1")));
}
