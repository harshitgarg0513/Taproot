export interface GenerationResult {
    provider: string;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    text: string;
}
export { complete } from "@eip/gemini";
