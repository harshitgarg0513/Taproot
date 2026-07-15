import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

const envPath = resolve(fileURLToPath(new URL("../../../.env", import.meta.url)));
dotenv.config({ path: envPath });

const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export interface GenerationResult {
  provider: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  text: string;
}

export async function complete(prompt: string): Promise<GenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === "YOUR_KEY") {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return {
    provider: "gemini",
    model,
    text: response.text ?? "",
  };
}
