export function optimize(ranked) {
    const seen = new Set();
    return ranked.filter((item) => {
        if (seen.has(item.id)) {
            return false;
        }
        seen.add(item.id);
        return true;
    });
}
