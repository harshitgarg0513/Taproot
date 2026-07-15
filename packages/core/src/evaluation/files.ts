import { execSync } from "child_process";

export function getChangedFiles(repo: string, hash: string) {
  const output = execSync(`git -C "${repo}" show --pretty='' --name-only ${hash}`).toString();

  return output
    .split("\n")
    .filter(Boolean);
}
