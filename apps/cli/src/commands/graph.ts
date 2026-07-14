import { analyzeRepository } from "@eip/analyzer";

export async function graph(repo: string) {
  const analysis = await analyzeRepository(repo);

  console.log();
  console.log("Dependency Graph");
  console.log("-------------------------");

  for (const edge of analysis.relationships) {
    console.log(edge.from, " --> ", edge.to);
  }

  console.log();
}
