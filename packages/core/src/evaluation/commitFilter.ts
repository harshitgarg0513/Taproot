export function shouldEvaluate(message: string, files: string[]) {
  const msg = message.toLowerCase();

  if (msg.startsWith("merge")) return false;
  if (msg.includes("format")) return false;
  if (msg.includes("lint")) return false;
  if (msg.includes("dependency")) return false;
  if (msg.includes("package")) return false;
  if (files.length > 20) return false;
  if (files.length === 0) return false;

  return true;
}
