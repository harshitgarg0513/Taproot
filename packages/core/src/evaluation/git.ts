export interface GitCommit {
  message: string;
  changedFiles: string[];
}

export function parseGitCommit(raw: string): GitCommit {
  void raw;
  return {
    message: "",
    changedFiles: [],
  };
}
