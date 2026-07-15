export class RepositoryNotFoundError extends Error {
    constructor(path) {
        super(`Repository not found: ${path}`);
    }
}
export class UnsupportedLanguageError extends Error {
    constructor(language) {
        super(`Unsupported language: ${language}`);
    }
}
export class ParseError extends Error {
    constructor(file) {
        super(`Failed to parse: ${file}`);
    }
}
