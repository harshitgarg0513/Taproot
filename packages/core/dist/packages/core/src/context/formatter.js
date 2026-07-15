export function formatPrompt(query, snippets) {
    let prompt = `You are an experienced software engineer.

Task

${query}

Repository Context
`;
    for (const snippet of snippets) {
        prompt += `
================================

FILE

${snippet.file}

--------------------------------

${snippet.content}
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
