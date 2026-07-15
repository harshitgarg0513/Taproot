import type { RepositoryModel } from "../types.js";
export interface RankedContext {
    id: string;
    path: string;
    score: number;
    reasons: string[];
}
export declare function rankContext(model: RepositoryModel, expanded: Set<string>): RankedContext[];
