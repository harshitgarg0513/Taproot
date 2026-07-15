import fs from "fs-extra";
import path from "path";
import { loadConfig } from "@eip/config";
export async function scanRepository(root) {
    const config = await loadConfig(root);
    const IGNORE = new Set(config.ignore);
    const result = {
        files: 0,
        directories: 0,
        extensions: new Set(),
    };
    async function walk(dir) {
        const entries = await fs.readdir(dir, {
            withFileTypes: true,
        });
        for (const entry of entries) {
            if (IGNORE.has(entry.name) || entry.name.startsWith("."))
                continue;
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                result.directories++;
                await walk(full);
            }
            else {
                result.files++;
                const ext = path.extname(entry.name);
                if (ext) {
                    result.extensions.add(ext);
                }
            }
        }
    }
    await walk(root);
    return result;
}
