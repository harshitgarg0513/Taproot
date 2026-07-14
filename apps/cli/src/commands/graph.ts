import { analyzeRepository } from "@eip/analyzer";

export async function graph(repo: string) {
  const analysisResult = await analyzeRepository(repo);

  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }

  const analysis = analysisResult.data;

  console.log();
  console.log("Dependency Graph");
  console.log("-------------------------");

  for (const edge of analysis.relationships) {
    console.log(edge.from, " --> ", edge.to);
  }

  console.log();
}
