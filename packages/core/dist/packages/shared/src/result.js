export function ok(data) {
    return {
        success: true,
        data,
    };
}
export function err(error) {
    return {
        success: false,
        error,
    };
}
