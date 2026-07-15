import { buildRepositoryModel, generate } from "@eip/core";

export async function context(repo: string, query: string) {
  const repoResult = await buildRepositoryModel(repo);

  if (!repoResult.success) {
    console.error(repoResult.error);
    return;
  }

  const contextPackage = await generate(repoResult.data, query);

  console.log("================================");
  console.log("Confidence");
  console.log(contextPackage.context.confidence.level);
  console.log(contextPackage.context.confidence.score.toFixed(2));
  console.log(contextPackage.context.confidence.reason);
  if (contextPackage.context.confidence.suggestions.length > 0) {
    console.log("Suggestions");
    for (const suggestion of contextPackage.context.confidence.suggestions) {
      console.log(`• ${suggestion}`);
    }
  }
  console.log("================================");

  if (!contextPackage.context.success) {
    return;
  }

  console.log(contextPackage.context.prompt);
  console.log();
  console.log("================================");
  console.log("Context Package");
  console.log("================================");
  console.log();
  console.log("Selected Files");
  console.table(contextPackage.context.budget);
  console.log();
  console.log("Prompt");
  console.log(contextPackage.context.prompt);
  console.log();
  console.log("Answer");
  console.log(contextPackage.answer);
}
