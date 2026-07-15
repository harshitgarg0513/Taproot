import { tokenize } from "./tokenizer.js";
import { buildVocabulary } from "./vocabulary.js";
import { generateCandidates } from "./candidates.js";
import { score } from "./scorer.js";
import { expand } from "./expander.js";
import { computeConfidence } from "./confidence.js";
export function retrieve(model, query) {
    const vocabulary = buildVocabulary(model);
    const candidateScores = generateCandidates(query, vocabulary);
    const ranked = score(candidateScores);
    const seeds = new Set(ranked.slice(0, 10).map((result) => result.id));
    const expanded = expand(model, seeds);
    const tokens = tokenize(query);
    const matchedTokenCount = ranked.filter((result) => result.score > 0).length;
    const confidence = computeConfidence(matchedTokenCount, tokens.length, seeds.size);
    return {
        query,
        tokens,
        ranked,
        expanded,
        confidence,
    };
}
