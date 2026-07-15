export function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function matches(query: string, candidate: string) {
  const q = normalize(query);
  const c = normalize(candidate);

  return c.includes(q) || q.includes(c);
}
