import type { CodeSnippet } from "./snippet.js";

export function formatPrompt(query: string, snippets: CodeSnippet[]) {
  let prompt = `You are a senior backend engineer.

Task

${query}

Repository Context
`;

  for (const snippet of snippets) {
    prompt += `
================================

File

${snippet.file}

Relevant snippet

\`\`\`ts
${snippet.content}
\`\`\`
`;
  }

  prompt += `
================================

Instructions

1. Only modify files shown above.

2. Explain every change.

3. If context is insufficient, explicitly say so.
`;

  return prompt;
}
