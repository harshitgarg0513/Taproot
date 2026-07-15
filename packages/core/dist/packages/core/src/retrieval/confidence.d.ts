export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
export interface ConfidenceResult {
    level: ConfidenceLevel;
    score: number;
    reason: string;
    suggestions: string[];
}
export declare function computeConfidence(matchedTokens: number, queryTokens: number, seedCount: number): ConfidenceResult;
