import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

const envPath = resolve(fileURLToPath(new URL("../../../.env", import.meta.url)));
dotenv.config({ path: envPath });

export interface GenerationResult {
  provider: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  text: string;
}

export async function complete(prompt: string): Promise<GenerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (!apiKey || apiKey === "YOUR_KEY") {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });
  const model = "claude-sonnet-4-20250514";
  const response = await client.messages.create({
    model,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const first = response.content[0];
  const text = first?.type === "text" ? first.text : "";

  return {
    provider: "anthropic",
    model,
    promptTokens: response.usage.input_tokens,
    completionTokens: response.usage.output_tokens,
    text,
  };
}
