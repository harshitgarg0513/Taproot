import fs from "fs/promises";
export async function loadSnippet(file, maxLines = 150) {
    const text = await fs.readFile(file, "utf8");
    const lines = text.split("\n");
    return {
        file,
        content: lines.slice(0, maxLines).join("\n"),
        lines: lines.length,
    };
}
