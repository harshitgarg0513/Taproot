import type { RepositoryModel } from "../types.js";
export interface RiskResult {
    target: string;
    score: number;
    level: "LOW" | "MEDIUM" | "HIGH";
    impactedFiles: string[];
    impactedSymbols: string[];
    impactedComponents: string[];
}
export declare function analyzeRisk(model: RepositoryModel, target: string): RiskResult;
