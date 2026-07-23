import fs from "fs";
import path from "path";

import { CachedRepositoryModel, RepositoryModel } from "../types.js";

interface CacheEntry {
  model: CachedRepositoryModel;
  timestamp: number;
}

function getCacheFilePath() {
  return path.resolve(process.cwd(), ".taproot-cache.json");
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
  fs.writeFileSync(
    cacheFile,
    JSON.stringify(Object.fromEntries(cache.entries()), null, 2),
  );
}

export function hydrateRepositoryModel(
  model: CachedRepositoryModel,
): RepositoryModel {
  return {
    ...model,
    componentIndex: new Map(
      model.components.map((component) => [component.id, component]),
    ),
    symbolIndex: new Map(model.symbols.map((symbol) => [symbol.id, symbol])),
  };
}

export function getCachedModel(key: string): RepositoryModel | null {
  const entry = readCache().get(key);

  if (!entry) return null;

  return hydrateRepositoryModel(entry.model);
}

export function setCachedModel(key: string, model: RepositoryModel) {
  const cache = readCache();

  cache.set(key, {
    model: {
      config: model.config,
      metrics: model.metrics,
      knowledgeGraph: model.knowledgeGraph,
      components: model.components,
      symbols: model.symbols,
      entities: model.entities,
      classified: model.classified,
      relationships: model.relationships,
      callGraph: model.callGraph,
    },
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
