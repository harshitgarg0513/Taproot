import type { RepositoryModel } from "../types.js";
export interface DependencySummary {
    imports: string[];
    importedBy: string[];
    calls: string[];
    calledBy: string[];
}
export declare function buildDependencySummary(model: RepositoryModel, file: string): DependencySummary;
