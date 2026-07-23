import { loadConfig } from "@taproot/config";

export async function config(repo: string) {
  const cfg = await loadConfig(repo);
  console.log(JSON.stringify(cfg, null, 2));
}
