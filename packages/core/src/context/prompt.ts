import { loadSnippet } from "./snippet.js";
import { formatPrompt } from "./formatter.js";

export async function buildPrompt(query: string, files: string[]) {
  const snippets = [];

  for (const file of files) {
    try {
      snippets.push(await loadSnippet(file));
    } catch (error) {
      void error;
    }
  }

  return formatPrompt(query, snippets);
}
