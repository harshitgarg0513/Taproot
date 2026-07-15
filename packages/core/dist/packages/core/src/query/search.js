import { matches, ok } from "@eip/shared";
export function searchRepository(model, query) {
    const components = model.components.filter((component) => matches(query, component.name) || matches(query, component.file));
    const symbols = model.symbols.filter((symbol) => matches(query, symbol.name) || matches(query, symbol.file));
    const files = [
        ...new Set([
            ...components.map((component) => component.file),
            ...symbols.map((symbol) => symbol.file),
        ]),
    ];
    return ok({
        components,
        symbols,
        files,
    });
}
