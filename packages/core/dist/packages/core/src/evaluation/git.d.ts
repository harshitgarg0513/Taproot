export interface GitCommit {
    message: string;
    changedFiles: string[];
}
export declare function parseGitCommit(raw: string): GitCommit;
