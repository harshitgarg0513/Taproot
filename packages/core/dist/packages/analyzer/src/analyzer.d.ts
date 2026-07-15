import { RepositoryAnalysis } from "./types.js";
import { Result } from "@eip/shared";
export declare function analyzeRepository(root: string): Promise<Result<RepositoryAnalysis>>;
