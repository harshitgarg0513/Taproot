import { analyzeRepository } from "@eip/analyzer";

export async function components(repo: string) {
  const analysis = await analyzeRepository(repo);

  console.log();
  console.log("Components");
  console.log("-------------------------" );

  for (const component of analysis.components) {
    console.log(`[${component.type}]`, component.name);
  }

  console.log();
}
