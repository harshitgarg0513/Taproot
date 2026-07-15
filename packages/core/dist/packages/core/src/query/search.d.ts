import { RepositoryModel } from "../types.js";
import { Result } from "@eip/shared";
export interface SearchResult {
    components: RepositoryModel["components"];
    symbols: RepositoryModel["symbols"];
    files: string[];
}
export declare function searchRepository(model: RepositoryModel, query: string): Result<SearchResult>;
