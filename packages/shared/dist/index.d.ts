type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
declare function ok<T>(data: T): Result<T>;
declare function err<E>(error: E): Result<never, E>;

declare class RepositoryNotFoundError extends Error {
    constructor(path: string);
}
declare class UnsupportedLanguageError extends Error {
    constructor(language: string);
}
declare class ParseError extends Error {
    constructor(file: string);
}

declare function normalize(text: string): string;
declare function matches(query: string, candidate: string): boolean;

declare function formatDuration(ms: number): string;
declare function printSection(title: string): void;

export { ParseError, RepositoryNotFoundError, type Result, UnsupportedLanguageError, err, formatDuration, matches, normalize, ok, printSection };
