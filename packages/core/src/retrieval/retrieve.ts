import type { RepositoryModel } from "../types.js";
import { tokenize } from "./tokenizer.js";
import { buildVocabulary } from "./vocabulary.js";
import { generateCandidates } from "./candidates.js";
import { score } from "./scorer.js";
import { expand } from "./expander.js";
import { computeConfidence } from "./confidence.js";

function resolvePath(model: RepositoryModel, id: string) {
  const component =
    model.componentIndex.get(id) ??
    model.components.find((candidate) => candidate.id === id);

  if (component?.file) {
    return component.file;
  }

  const symbol =
    model.symbolIndex.get(id) ??
    model.symbols.find((candidate) => candidate.id === id);

  if (symbol?.file) {
    return symbol.file;
  }

  const entity = model.entities.find((candidate) => candidate.id === id);
  return entity?.file ?? id;
}

export function retrieve(model: RepositoryModel, query: string) {
  const vocabulary = buildVocabulary(model);
  const candidateScores = generateCandidates(query, vocabulary);
  const ranked = score(candidateScores).map((result) => ({
    ...result,
    path: resolvePath(model, result.id),
  }));

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
