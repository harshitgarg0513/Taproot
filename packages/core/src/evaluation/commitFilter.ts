export function shouldEvaluate(message: string, changedFiles: number) {
  const msg = message.toLowerCase();

  if (msg.startsWith("merge")) return false;
  if (msg.includes("format")) return false;
  if (msg.includes("lint")) return false;
  if (msg.includes("dependency")) return false;
  if (msg.includes("package")) return false;
  if (changedFiles > 20) return false;

  return true;
}
