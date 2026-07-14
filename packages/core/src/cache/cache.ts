import { RepositoryModel } from "../types.js";

interface CacheEntry {
  model: RepositoryModel;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export function getCachedModel(key: string): RepositoryModel | null {
  const entry = cache.get(key);

  if (!entry) return null;

  return entry.model;
}

export function setCachedModel(key: string, model: RepositoryModel) {
  cache.set(key, {
    model,
    timestamp: Date.now(),
  });
}

export function clearCache() {
  cache.clear();
}

export function cacheSize() {
  return cache.size;
}
