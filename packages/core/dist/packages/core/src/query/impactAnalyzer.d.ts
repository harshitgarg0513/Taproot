import { RepositoryModel } from "../types.js";
import { Result } from "@eip/shared";
export interface ImpactResult {
    changedFile: string;
    impactedFiles: string[];
    impactedComponents: string[];
    impactedSymbols: string[];
}
export declare function analyzeImpact(model: RepositoryModel, changedFile: string): Result<ImpactResult>;
