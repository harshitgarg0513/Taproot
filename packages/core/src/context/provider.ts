import { complete as completeWithAnthropic } from "@taproot/anthropic";
import { complete as completeWithGemini } from "@taproot/gemini";

export interface GenerationResult {
  provider: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  text: string;
}

function hasAnthropicKey() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  return Boolean(apiKey && apiKey !== "YOUR_KEY");
}

export async function complete(prompt: string): Promise<GenerationResult> {
  try {
    return await completeWithGemini(prompt);
  } catch (geminiError) {
    if (!hasAnthropicKey()) {
      throw geminiError;
    }

    try {
      return await completeWithAnthropic(prompt);
    } catch (anthropicError) {
      const geminiMessage = geminiError instanceof Error ? geminiError.message : String(geminiError);
      const anthropicMessage =
        anthropicError instanceof Error ? anthropicError.message : String(anthropicError);
      throw new Error(
        `Generation failed. Gemini: ${geminiMessage} | Anthropic: ${anthropicMessage}`,
        { cause: anthropicError },
      );
    }
  }
}
