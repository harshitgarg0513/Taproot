import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

const envPath = resolve(fileURLToPath(new URL("../../../.env", import.meta.url)));
dotenv.config({ path: envPath });

const fallbackModels = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];

function getCandidateModels(): string[] {
  const configuredModel = process.env.GEMINI_MODEL?.trim();

  return [...new Set([...(configuredModel ? [configuredModel] : []), ...fallbackModels])];
}

function isUnavailableModelError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";
  const status = "status" in error && typeof error.status === "number" ? error.status : undefined;

  return (
    status === 404 ||
    status === 400 ||
    /not available|not found|unsupported|deprecated|invalid model/i.test(message)
  );
}

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";
  const status = "status" in error && typeof error.status === "number" ? error.status : undefined;

  return status === 429 || /RESOURCE_EXHAUSTED/i.test(message);
}

function parseRetryDelayMs(error: unknown): number {
  const defaultDelayMs = 5000;

  if (!error || typeof error !== "object") {
    return defaultDelayMs;
  }

  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  const retryMatch = message.match(/retry(?:Delay|In|After)?["']?\s*[:=]?\s*"?(\d+(?:\.\d+)?)\s*s/i);
  if (retryMatch?.[1]) {
    return Math.ceil(Number.parseFloat(retryMatch[1]) * 1000);
  }

  const body =
    "errorDetails" in error && Array.isArray(error.errorDetails)
      ? JSON.stringify(error.errorDetails)
      : message;

  const bodyMatch = body.match(/retryDelay["']?\s*[:=]\s*"?(\d+(?:\.\d+)?)\s*s/i);
  if (bodyMatch?.[1]) {
    return Math.ceil(Number.parseFloat(bodyMatch[1]) * 1000);
  }

  return defaultDelayMs;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const errors: string[] = [];

  for (const model of getCandidateModels()) {
    let retriedRateLimit = false;

    while (true) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        return {
          provider: "gemini",
          model,
          text: response.text ?? "",
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        if (isRateLimitError(error) && !retriedRateLimit) {
          retriedRateLimit = true;
          const delayMs = parseRetryDelayMs(error);
          await sleep(delayMs);
          continue;
        }

        errors.push(`${model}: ${message}`);

        if (!isUnavailableModelError(error)) {
          throw error;
        }

        break;
      }
    }
  }

  throw new Error(`Unable to generate content with Gemini. Tried: ${errors.join(" | ")}`);
}
