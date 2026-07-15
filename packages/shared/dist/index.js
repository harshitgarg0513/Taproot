// src/result.ts
function ok(data) {
  return {
    success: true,
    data
  };
}
function err(error) {
  return {
    success: false,
    error
  };
}

// src/errors.ts
var RepositoryNotFoundError = class extends Error {
  constructor(path) {
    super(`Repository not found: ${path}`);
  }
};
var UnsupportedLanguageError = class extends Error {
  constructor(language) {
    super(`Unsupported language: ${language}`);
  }
};
var ParseError = class extends Error {
  constructor(file) {
    super(`Failed to parse: ${file}`);
  }
};

// src/matcher.ts
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function matches(query, candidate) {
  const q = normalize(query);
  const c = normalize(candidate);
  return c.includes(q) || q.includes(c);
}

// src/index.ts
function formatDuration(ms) {
  return `${ms}ms`;
}
function printSection(title) {
  console.log();
  console.log("=".repeat(50));
  console.log(title);
  console.log("=".repeat(50));
}
export {
  ParseError,
  RepositoryNotFoundError,
  UnsupportedLanguageError,
  err,
  formatDuration,
  matches,
  normalize,
  ok,
  printSection
};
