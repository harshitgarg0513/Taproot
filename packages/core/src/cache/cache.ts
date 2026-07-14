import fs from "fs";
import path from "path";

import { RepositoryModel } from "../types.js";

interface CacheEntry {
  model: RepositoryModel;
  timestamp: number;
}

function getCacheFilePath() {
  return path.resolve(process.cwd(), ".eip-cache.json");
}

function readCache(): Map<string, CacheEntry> {
  const cacheFile = getCacheFilePath();

  if (!fs.existsSync(cacheFile)) {
    return new Map<string, CacheEntry>();
  }

  try {
    const raw = fs.readFileSync(cacheFile, "utf8");
    const parsed = JSON.parse(raw) as Record<string, CacheEntry>;

    return new Map(Object.entries(parsed));
  } catch {
    return new Map<string, CacheEntry>();
  }
}

function writeCache(cache: Map<string, CacheEntry>) {
  const cacheFile = getCacheFilePath();

  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(Object.fromEntries(cache.entries()), null, 2));
}

export function getCachedModel(key: string): RepositoryModel | null {
  const entry = readCache().get(key);

  if (!entry) return null;

  return entry.model;
}

export function setCachedModel(key: string, model: RepositoryModel) {
  const cache = readCache();

  cache.set(key, {
    model,
    timestamp: Date.now(),
  });

  writeCache(cache);
}

export function clearCache() {
  const cacheFile = getCacheFilePath();

  if (fs.existsSync(cacheFile)) {
    fs.unlinkSync(cacheFile);
  }
}

export function cacheSize() {
  return readCache().size;
}
