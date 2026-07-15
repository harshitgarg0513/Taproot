import type { AIProvider } from "@eip/core";

export class OpenAIProvider implements AIProvider {
  async complete(prompt: string): Promise<string> {
    return prompt;
  }
}
