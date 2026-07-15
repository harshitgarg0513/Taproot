const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "to",
  "for",
  "of",
  "implement",
  "create",
  "add",
  "make",
  "support",
  "enable",
  "allow",
  "using",
  "with",
  "in",
  "on",
]);

export function tokenize(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));
}
