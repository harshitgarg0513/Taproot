import type { AIProvider } from "@eip/core";

export class GeminiProvider implements AIProvider {
  async complete(prompt: string): Promise<string> {
    return prompt;
  }
}
