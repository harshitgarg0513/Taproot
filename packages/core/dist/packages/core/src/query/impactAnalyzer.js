import { ok } from "@eip/shared";
export function analyzeImpact(model, changedFile) {
    const impactedFiles = new Set();
    const impactedComponents = new Set();
    const impactedSymbols = new Set();
    function dfs(file) {
        if (impactedFiles.has(file))
            return;
        impactedFiles.add(file);
        for (const edge of model.relationships) {
            if (edge.to === file) {
                dfs(edge.from);
            }
        }
    }
    dfs(changedFile);
    for (const symbol of model.symbols) {
        if (impactedFiles.has(symbol.file)) {
            impactedSymbols.add(symbol.name);
        }
    }
    for (const component of model.components) {
        if (impactedFiles.has(component.file)) {
            impactedComponents.add(component.name);
        }
    }
    return ok({
        changedFile,
        impactedFiles: [...impactedFiles],
        impactedComponents: [...impactedComponents],
        impactedSymbols: [...impactedSymbols],
    });
}
