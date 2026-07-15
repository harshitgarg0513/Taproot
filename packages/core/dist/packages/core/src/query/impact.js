export function impactedFiles(model, file) {
    const visited = new Set();
    function dfs(current) {
        if (visited.has(current))
            return;
        visited.add(current);
        const next = model.relationships.filter((r) => r.from === current);
        for (const edge of next) {
            dfs(edge.to);
        }
    }
    dfs(file);
    return [...visited];
}
