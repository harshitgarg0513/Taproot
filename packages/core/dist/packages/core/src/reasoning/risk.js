import { matches } from "@eip/shared";
export function analyzeRisk(model, target) {
    const seedFiles = new Set();
    for (const component of model.components) {
        if (matches(target, component.name) || matches(target, component.file)) {
            seedFiles.add(component.file);
        }
    }
    for (const symbol of model.symbols) {
        if (matches(target, symbol.name) || matches(target, symbol.file)) {
            seedFiles.add(symbol.file);
        }
    }
    const targetMatches = model.relationships.filter((relationship) => {
        return (seedFiles.has(relationship.from) ||
            seedFiles.has(relationship.to) ||
            matches(target, relationship.from) ||
            matches(target, relationship.to));
    });
    const impactedFiles = Array.from(new Set(targetMatches.flatMap((relationship) => [relationship.from, relationship.to])));
    const impactedSymbols = model.symbols
        .filter((symbol) => impactedFiles.includes(symbol.file))
        .map((symbol) => symbol.name);
    const impactedComponents = model.classified
        .filter((component) => impactedFiles.includes(component.entity.file))
        .map((component) => component.entity.name);
    const score = Math.min(100, impactedFiles.length * 8 + impactedSymbols.length * 0.5);
    let level;
    if (score < 30) {
        level = "LOW";
    }
    else if (score < 70) {
        level = "MEDIUM";
    }
    else {
        level = "HIGH";
    }
    return {
        target,
        score,
        level,
        impactedFiles: [...new Set(impactedFiles)],
        impactedSymbols: [...new Set(impactedSymbols)],
        impactedComponents: [...new Set(impactedComponents)],
    };
}
