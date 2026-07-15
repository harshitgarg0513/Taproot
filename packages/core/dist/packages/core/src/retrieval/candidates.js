import { tokenize } from "./tokenizer.js";
export function generateCandidates(query, vocabulary) {
    const scores = new Map();
    for (const token of tokenize(query)) {
        const ids = vocabulary.get(token);
        if (!ids)
            continue;
        for (const id of ids) {
            scores.set(id, (scores.get(id) ?? 0) + 1);
        }
    }
    return scores;
}
