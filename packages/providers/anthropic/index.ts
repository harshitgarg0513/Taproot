import type { AIProvider } from "@eip/core";

export class AnthropicProvider implements AIProvider {
  async complete(prompt: string): Promise<string> {
    return prompt;
  }
}
