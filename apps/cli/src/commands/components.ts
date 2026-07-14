import { analyzeRepository } from "@eip/analyzer";

export async function components(repo: string) {
  const analysisResult = await analyzeRepository(repo);

  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }

  const analysis = analysisResult.data;

  console.log();
  console.log("Components");
  console.log("-------------------------");

  for (const component of analysis.components) {
    console.log(
      `${component.type.padEnd(15)}`,
      component.name.padEnd(30),
      `(${component.file.split("/").pop()})`,
    );
  }

  console.log();
}
