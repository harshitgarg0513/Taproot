import type { RankedContext } from "./ranker.js";

export function buildPrompt(query: string, context: RankedContext[]) {
  let prompt = `Engineering Task

${query}

Relevant Repository Context
`;

  for (const item of context) {
    prompt += `\n${item.id}`;
  }

  return prompt;
}
