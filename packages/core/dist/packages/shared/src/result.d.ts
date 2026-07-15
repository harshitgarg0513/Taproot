export type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
export declare function ok<T>(data: T): Result<T>;
export declare function err<E>(error: E): Result<never, E>;
