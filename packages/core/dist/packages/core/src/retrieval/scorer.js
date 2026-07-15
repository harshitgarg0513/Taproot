export function score(candidateScores) {
    const results = [];
    for (const [id, score] of candidateScores) {
        results.push({
            id,
            score,
            reasons: ["matched repository vocabulary"],
        });
    }
    results.sort((a, b) => b.score - a.score);
    return results;
}
