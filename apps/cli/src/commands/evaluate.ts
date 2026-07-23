import {
  buildRepositoryModel,
  evaluateCommit,
  getChangedFiles,
  getCommitHistory,
  printReport,
  shouldEvaluate,
} from "@taproot/core";

export async function evaluate(repo: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  const history = getCommitHistory(repo);
  const results = [];

  for (const commit of history) {
    const files = getChangedFiles(repo, commit.hash);

    if (!shouldEvaluate(commit.message, files)) {
      continue;
    }

    results.push(evaluateCommit(result.data, commit.message, files, repo));
  }

  printReport(results);
}
