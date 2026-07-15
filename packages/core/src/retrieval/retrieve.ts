import type { RepositoryModel } from "../types.js";
import { tokenize } from "./tokenizer.js";
import { buildVocabulary } from "./vocabulary.js";
import { generateCandidates } from "./candidates.js";
import { score } from "./scorer.js";
import { expand } from "./expander.js";

export function retrieve(model: RepositoryModel, query: string) {
  const vocabulary = buildVocabulary(model);
  const candidateScores = generateCandidates(query, vocabulary);
  const ranked = score(candidateScores);

  const seeds = new Set(ranked.slice(0, 10).map((result) => result.id));
  const expanded = expand(model, seeds);

  return {
    query,
    tokens: tokenize(query),
    ranked,
    expanded,
  };
}
