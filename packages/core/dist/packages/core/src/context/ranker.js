export function rankContext(model, expanded) {
    const ranked = [];
    for (const id of expanded) {
        let score = 0;
        const reasons = [];
        const degree = model.knowledgeGraph.edges.filter((edge) => edge.from === id || edge.to === id).length;
        score += degree;
        reasons.push(`graph-degree:${degree}`);
        const component = model.componentIndex.get(id) ??
            model.components.find((candidate) => candidate.id === id);
        const symbol = model.symbolIndex.get(id) ??
            model.symbols.find((candidate) => candidate.id === id);
        const path = component?.file ?? symbol?.file ?? id;
        const displayId = component?.name ?? symbol?.name ?? id;
        ranked.push({
            id: displayId,
            path,
            score,
            reasons,
        });
    }
    ranked.sort((a, b) => b.score - a.score);
    return ranked;
}
