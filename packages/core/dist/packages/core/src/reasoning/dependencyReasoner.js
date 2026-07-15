export function buildDependencySummary(model, file) {
    const imports = model.relationships
        .filter((relationship) => relationship.from === file)
        .map((relationship) => relationship.to);
    const importedBy = model.relationships
        .filter((relationship) => relationship.to === file)
        .map((relationship) => relationship.from);
    const calls = model.callGraph
        .filter((call) => call.file === file)
        .map((call) => call.callee);
    const calledBy = model.callGraph
        .filter((call) => call.callee === file)
        .map((call) => call.caller);
    return {
        imports,
        importedBy,
        calls,
        calledBy,
    };
}
