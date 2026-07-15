export function buildKnowledgeGraph(model) {
    const graph = {
        nodes: [],
        edges: [],
    };
    for (const component of model.components) {
        graph.nodes.push({
            id: component.id,
            type: "Component",
            label: component.name,
        });
    }
    for (const symbol of model.symbols) {
        graph.nodes.push({
            id: symbol.id,
            type: "Symbol",
            label: symbol.name,
        });
    }
    for (const component of model.components) {
        const related = model.symbols.filter((s) => s.file === component.file);
        for (const symbol of related) {
            graph.edges.push({
                from: component.id,
                to: symbol.id,
                relation: "contains",
            });
        }
    }
    for (const edge of model.relationships) {
        graph.edges.push({
            from: edge.from,
            to: edge.to,
            relation: "imports",
        });
    }
    for (const call of model.callGraph) {
        graph.edges.push({
            from: call.caller,
            to: call.callee,
            relation: "calls",
        });
    }
    return graph;
}
