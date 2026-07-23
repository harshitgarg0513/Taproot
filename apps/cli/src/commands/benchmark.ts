import { buildRepositoryModel } from "@taproot/core";

export async function benchmark(repo: string) {
  const start = performance.now();
  const result = await buildRepositoryModel(repo);
  const total = performance.now() - start;

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const m = result.data.metrics;

  console.log();
  console.log("Benchmark");
  console.log("----------------");
  console.log();
  console.log("Observer :", m.observerMs.toFixed(2), "ms");
  console.log("Analyzer :", m.analyzerMs.toFixed(2), "ms");
  console.log("Graph :", m.graphMs.toFixed(2), "ms");
  console.log("Total :", total.toFixed(2), "ms");
}
