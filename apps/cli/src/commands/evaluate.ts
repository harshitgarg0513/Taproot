import { buildRepositoryModel, evaluateCommit, printReport } from "@eip/core";

export async function evaluate(repo: string) {
  const result = await buildRepositoryModel(repo);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  /*
   Temporary sample.
   Sprint Release
   will use
   real git history.
  */

  const metrics = evaluateCommit(result.data, "implement refresh tokens", []);
  printReport([metrics]);
}
