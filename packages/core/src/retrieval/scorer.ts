export interface RetrievalResult {
  id: string;
  path: string;
  score: number;
  reasons: string[];
}

export function score(candidateScores: Map<string, number>) {
  const results: RetrievalResult[] = [];

  for (const [id, score] of candidateScores) {
    results.push({
      id,
      path: id,
      score,
      reasons: ["matched repository vocabulary"],
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
