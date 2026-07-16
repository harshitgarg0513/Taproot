import type { RepositoryModel } from "../types.js";
import { tokenize } from "./tokenizer.js";
import { buildVocabulary } from "./vocabulary.js";
import { generateCandidates } from "./candidates.js";
import { expand } from "./expander.js";
import { computeConfidence } from "./confidence.js";

export interface RetrievalResult {
  id: string;
  path: string;
  score: number;
  reasons: string[];
  ids: string[];
}

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

function resolveDetails(model: RepositoryModel, id: string) {
  return (
    model.componentIndex.get(id) ??
    model.symbolIndex.get(id) ??
    model.components.find((candidate) => candidate.id === id) ??
    model.symbols.find((candidate) => candidate.id === id) ??
    model.entities.find((candidate) => candidate.id === id)
  );
}

function buildEntry(path: string, id: string, score: number, reasons: string[]) {
  return {
    id: path,
    path,
    score,
    reasons,
    ids: [id],
  };
}

export function retrieve(model: RepositoryModel, query: string) {
  const tokens = tokenize(query);
  const vocabulary = buildVocabulary(model);
  const candidateScores = generateCandidates(query, vocabulary);
  const byPath = new Map<string, RetrievalResult>();

  for (const [id, tokenCount] of candidateScores) {
    const path = resolvePath(model, id);
    const details = resolveDetails(model, id);
    const entry = byPath.get(path) ?? buildEntry(path, id, 0, []);
    let score = tokenCount * 8;
    const reasons = new Set<string>(entry.reasons);

    reasons.add("matched vocabulary");

    const normalizedPath = path.split("/").pop() ?? path;
    const fileTokens = tokenize(normalizedPath);
    const filenameMatch = fileTokens.some((token) => tokens.includes(token));

    if (filenameMatch) {
      score += 10;
      reasons.add("matched filename");
    }

    if (details && "type" in details && details.type) {
      score += 6;
      reasons.add("matched component");
    } else if (details && "kind" in details && details.kind) {
      score += 4;
      reasons.add("matched symbol");
    }

    entry.score += score;
    entry.reasons = Array.from(reasons);
    entry.ids = Array.from(new Set([...entry.ids, id]));
    byPath.set(path, entry);
  }

  const ranked = Array.from(byPath.values()).sort((a, b) => b.score - a.score);
  const topSeeds = ranked.slice(0, 8).flatMap((item) => item.ids);
  const expanded = expand(model, new Set(topSeeds));

  for (const id of expanded) {
    const path = resolvePath(model, id);
    const entry = byPath.get(path) ?? buildEntry(path, id, 0, []);
    entry.score += 2;
    entry.reasons = Array.from(new Set([...entry.reasons, "graph expansion"]));
    entry.ids = Array.from(new Set([...entry.ids, id]));
    byPath.set(path, entry);
  }

  const finalRanked = Array.from(byPath.values()).sort((a, b) => b.score - a.score);
  const matchedVocabulary = finalRanked.filter((item) => item.reasons.includes("matched vocabulary")).length;
  const filenameMatches = finalRanked.filter((item) => item.reasons.includes("matched filename")).length;
  const symbolMatches = finalRanked.filter((item) => item.reasons.includes("matched symbol")).length;
  const graphCoverage = finalRanked.filter((item) => item.reasons.includes("graph expansion")).length;

  const confidence = computeConfidence(
    matchedVocabulary,
    filenameMatches,
    graphCoverage,
    symbolMatches,
    tokens.length,
  );

  return {
    query,
    tokens,
    ranked: finalRanked,
    expanded,
    confidence,
  };
}
