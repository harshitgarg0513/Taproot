import type { RepositoryModel } from "../types.js";
export declare function retrieve(model: RepositoryModel, query: string): {
    query: string;
    tokens: string[];
    ranked: import("./scorer.js").RetrievalResult[];
    expanded: Set<string>;
    confidence: import("./confidence.js").ConfidenceResult;
};
