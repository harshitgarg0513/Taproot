interface GenerationResult {
    provider: string;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    text: string;
}
declare function complete(prompt: string): Promise<GenerationResult>;

export { type GenerationResult, complete };
