import fs from "fs/promises";

export interface CodeSnippet {
  file: string;
  content: string;
  lines: number;
}

export async function loadSnippet(file: string, maxLines = 150): Promise<CodeSnippet> {
  const text = await fs.readFile(file, "utf8");
  const lines = text.split("\n");

  return {
    file,
    content: lines.slice(0, maxLines).join("\n"),
    lines: lines.length,
  };
}
