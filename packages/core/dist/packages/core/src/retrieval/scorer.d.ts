export interface RetrievalResult {
    id: string;
    score: number;
    reasons: string[];
}
export declare function score(candidateScores: Map<string, number>): RetrievalResult[];
