import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

const envPath = resolve(fileURLToPath(new URL("../../../.env", import.meta.url)));
dotenv.config({ path: envPath });

export async function complete(prompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (!apiKey || apiKey === "YOUR_KEY") {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const first = response.content[0];

  if (!first || first.type !== "text") {
    return "";
  }

  return first.text;
}
