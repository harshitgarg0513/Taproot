import { analyzeRepository } from "@eip/analyzer";

export async function calls(repo: string) {
  const analysisResult = await analyzeRepository(repo);

  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }

  const analysis = analysisResult.data;

  console.log();
  console.log("Call Graph");
  console.log("----------------------");

  for (const edge of analysis.callGraph) {
    console.log(edge.caller, "->", edge.callee);
  }
}
