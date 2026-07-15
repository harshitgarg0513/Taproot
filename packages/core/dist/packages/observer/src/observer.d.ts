import { RepositorySnapshot } from "./types.js";
import { Result } from "@eip/shared";
export declare function observeRepository(root: string): Promise<Result<RepositorySnapshot>>;
