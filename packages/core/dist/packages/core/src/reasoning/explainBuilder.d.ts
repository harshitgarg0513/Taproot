import type { RepositoryModel } from "../types.js";
export interface ExplainComponentResult {
    component: string;
    file: string;
    kind: string;
    source: "component" | "symbol";
}
export declare function explainComponent(model: RepositoryModel, query: string): ExplainComponentResult | null;
export declare function explain(model: RepositoryModel, entityName: string): {
    name: string;
    kind: import("@eip/analyzer").EntityKind;
    classification: {
        type: string;
        confidence: number;
        signals: import("@eip/analyzer").ClassificationSignal[];
    }[];
    responsibility: string;
    dependency: import("./dependencyReasoner.js").DependencySummary;
} | null;
