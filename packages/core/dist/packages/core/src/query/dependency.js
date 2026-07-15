export function dependenciesOf(model, file) {
    return model.relationships.filter((r) => r.from === file);
}
export function dependentsOf(model, file) {
    return model.relationships.filter((r) => r.to === file);
}
