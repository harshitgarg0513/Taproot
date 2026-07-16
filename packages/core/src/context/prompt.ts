import type { RankedContext } from "./ranker.js";
import { loadSnippet } from "./snippet.js";
import { formatPrompt } from "./formatter.js";

export async function buildPrompt(repo: string, query: string, items: RankedContext[]) {
  const snippets = [];

  for (const item of items) {
    try {
      const preferredTerms = item.reasons.flatMap((reason) =>
        reason.split(/\s+/).filter(Boolean),
      );

      snippets.push(
        await loadSnippet(repo, item.path, 60, preferredTerms),
      );
    } catch (error) {
      void error;
    }
  }

  return formatPrompt(query, snippets);
}
