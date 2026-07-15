import { retrieve } from "../retrieval/index.js";
import type { RepositoryModel } from "../types.js";
type ContextBuildResult = {
    success: true;
    retrieval: ReturnType<typeof retrieve>;
    confidence: ReturnType<typeof retrieve>["confidence"];
    budget: Array<{
        id: string;
        path: string;
        score: number;
        reasons: string[];
    }>;
    prompt: string;
} | {
    success: false;
    confidence: ReturnType<typeof retrieve>["confidence"];
    message: string;
};
export declare function generate(model: RepositoryModel, query: string): Promise<{
    context: {
        success: false;
        confidence: ReturnType<typeof retrieve>["confidence"];
        message: string;
    };
    answer: string;
    generation: undefined;
} | {
    context: {
        success: true;
        retrieval: ReturnType<typeof retrieve>;
        confidence: ReturnType<typeof retrieve>["confidence"];
        budget: Array<{
            id: string;
            path: string;
            score: number;
            reasons: string[];
        }>;
        prompt: string;
    };
    answer: string;
    generation: import("packages/providers/gemini/index.js").GenerationResult;
}>;
export declare function buildContext(model: RepositoryModel, query: string): Promise<ContextBuildResult>;
export {};
