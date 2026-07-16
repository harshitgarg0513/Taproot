export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ConfidenceResult {
  level: ConfidenceLevel;
  score: number;
  reason: string;
  suggestions: string[];
}

export function computeConfidence(
  matchedVocabulary: number,
  filenameMatches: number,
  graphCoverage: number,
  symbolMatches: number,
  queryTokens: number,
): ConfidenceResult {
  const normalized = Math.max(
    0,
    Math.min(
      1,
      (matchedVocabulary * 0.45 +
        filenameMatches * 0.3 +
        graphCoverage * 0.15 +
        symbolMatches * 0.1) /
        Math.max(1, queryTokens),
    ),
  );

  const score = Number((normalized * 100).toFixed(0));

  if (score >= 80) {
    return {
      level: "HIGH",
      score,
      reason: "Repository vocabulary matched strongly.",
      suggestions: [],
    };
  }

  if (score >= 50) {
    return {
      level: "MEDIUM",
      score,
      reason: "Partial repository vocabulary matched.",
      suggestions: [],
    };
  }

  return {
    level: "LOW",
    score,
    reason: "No repository vocabulary matched.",
    suggestions: [
      "Try component names.",
      "Try feature names.",
      "Try endpoint names.",
    ],
  };
}
