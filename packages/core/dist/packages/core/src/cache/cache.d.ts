import { RepositoryModel } from "../types.js";
export declare function getCachedModel(key: string): RepositoryModel | null;
export declare function setCachedModel(key: string, model: RepositoryModel): void;
export declare function clearCache(): void;
export declare function cacheSize(): number;
