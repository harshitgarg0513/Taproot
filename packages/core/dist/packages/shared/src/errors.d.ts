export declare class RepositoryNotFoundError extends Error {
    constructor(path: string);
}
export declare class UnsupportedLanguageError extends Error {
    constructor(language: string);
}
export declare class ParseError extends Error {
    constructor(file: string);
}
