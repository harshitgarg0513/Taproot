import { buildRepositoryModel, generate } from "@taproot/core";

export async function context(repo: string, query: string) {
  const repoResult = await buildRepositoryModel(repo);

  if (!repoResult.success) {
    console.error(repoResult.error);
    return;
  }

  const contextPackage = await generate(repoResult.data, query, repo);

  console.log("================================");
  console.log("Confidence");
  console.log(contextPackage.context.confidence.level);
  console.log(`${Math.round(contextPackage.context.confidence.score)}%`);
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
  console.table(
    contextPackage.context.budget.map((item) => ({
      file: item.path,
      score: item.score,
      reasons: item.reasons.join(", "),
    })),
  );
  console.log();
  console.log("Prompt");
  console.log(contextPackage.context.prompt);
  console.log();
  console.log("Prompt Tokens");
  console.log(contextPackage.context.promptTokens);
  console.log();
  console.log("Answer");

  const generationError = "error" in contextPackage ? contextPackage.error : undefined;

  if (generationError) {
    console.error("Generation failed:", generationError.message);
    return;
  }

  console.log(contextPackage.generation?.text ?? contextPackage.answer);
}
