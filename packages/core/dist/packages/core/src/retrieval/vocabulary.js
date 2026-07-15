export function buildVocabulary(model) {
    const vocabulary = new Map();
    function add(token, id) {
        if (!vocabulary.has(token)) {
            vocabulary.set(token, new Set());
        }
        vocabulary.get(token).add(id);
    }
    function addAliases(token, id) {
        add(token, id);
        if (token.length > 3 && token.endsWith("s")) {
            add(token.slice(0, -1), id);
        }
        else if (token.length > 3) {
            add(`${token}s`, id);
        }
    }
    const split = (text) => text
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_.-]/g, " ")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
    for (const entity of model.entities) {
        for (const token of split(entity.name)) {
            addAliases(token, entity.id);
        }
    }
    for (const symbol of model.symbols) {
        for (const token of split(symbol.name)) {
            addAliases(token, symbol.id);
        }
    }
    return vocabulary;
}
