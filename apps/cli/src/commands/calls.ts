import { analyzeRepository } from "@eip/analyzer";

export async function calls(repo: string) {
  const analysis = await analyzeRepository(repo);

  console.log();
  console.log("Call Graph");
  console.log("----------------------");

  for (const edge of analysis.callGraph) {
    console.log(edge.caller, "->", edge.callee);
  }
}
