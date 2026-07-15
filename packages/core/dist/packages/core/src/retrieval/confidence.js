export function computeConfidence(matchedTokens, queryTokens, seedCount) {
    const tokenRatio = queryTokens === 0 ? 0 : matchedTokens / queryTokens;
    const seedFactor = Math.min(seedCount, 10) / 10;
    const score = Math.max(tokenRatio * 0.7 + seedFactor * 0.3, tokenRatio * 0.5 + 0.2);
    if (score >= 0.8) {
        return {
            level: "HIGH",
            score,
            reason: "Repository vocabulary matched strongly.",
            suggestions: [],
        };
    }
    if (score >= 0.4) {
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
        reason: "Very little repository vocabulary matched.",
        suggestions: [
            "Try different engineering terminology.",
            "Search by component name.",
            "Search by symbol name.",
        ],
    };
}
