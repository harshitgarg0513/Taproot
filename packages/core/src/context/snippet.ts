import fs from "fs/promises";
import path from "path";

export interface CodeSnippet {
  file: string;
  content: string;
  lines: number;
  startLine: number;
  endLine: number;
}

export async function loadSnippet(
  repo: string,
  file: string,
  maxLines = 60,
  preferredTerms: string[] = [],
): Promise<CodeSnippet> {
  const absolutePath = path.isAbsolute(file)
    ? file
    : path.resolve(repo, file);
  const displayPath = path.relative(repo, absolutePath) || path.basename(absolutePath);
  const text = await fs.readFile(absolutePath, "utf8");
  const lines = text.split(/\r?\n/);
  const meaningful = lines
    .map((line, index) => ({ line: index + 1, text: line }))
    .filter((entry) => entry.text.trim().length > 0);

  if (meaningful.length === 0) {
    return {
      file: displayPath,
      content: "",
      lines: 0,
      startLine: 1,
      endLine: 1,
    };
  }

  let startLine = 1;
  let endLine = Math.min(lines.length, maxLines);

  if (preferredTerms.length > 0) {
    const match = meaningful.find((entry) =>
      preferredTerms.some((term) =>
        entry.text.toLowerCase().includes(term.toLowerCase()),
      ),
    );

    if (match) {
      startLine = Math.max(1, match.line - 30);
      endLine = Math.min(lines.length, match.line + 60);
    }
  }

  if (startLine === 1 && endLine === Math.min(lines.length, maxLines)) {
    const sample = meaningful.slice(0, maxLines);
    const first = sample[0];
    const last = sample[sample.length - 1];

    if (first && last) {
      startLine = first.line;
      endLine = last.line;
    }
  }

  const content = lines.slice(startLine - 1, endLine).join("\n").trim();

  return {
    file: displayPath,
    content,
    lines: lines.length,
    startLine,
    endLine,
  };
}
