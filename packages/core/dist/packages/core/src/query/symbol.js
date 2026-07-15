export function findSymbol(model, name) {
    return model.symbols.filter((s) => s.name === name);
}
