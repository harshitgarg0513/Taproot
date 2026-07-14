export class RepositoryNotFoundError extends Error {
  constructor(path: string) {
    super(`Repository not found: ${path}`);
  }
}

export class UnsupportedLanguageError extends Error {
  constructor(language: string) {
    super(`Unsupported language: ${language}`);
  }
}

export class ParseError extends Error {
  constructor(file: string) {
    super(`Failed to parse: ${file}`);
  }
}
