import { execSync } from "child_process";

export interface Commit {
  hash: string;
  message: string;
}

export function getCommitHistory(repo: string, limit = 30): Commit[] {
  const output = execSync(`git -C "${repo}" log --pretty=format:%H:::%s -n ${limit}`).toString();

  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, message] = line.split(":::");
      return {
        hash: hash ?? "",
        message: message ?? "",
      };
    });
}
