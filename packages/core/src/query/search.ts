import { RepositoryModel } from "../types.js";

export interface SearchResult {
  components: RepositoryModel["components"];
  symbols: RepositoryModel["symbols"];
  files: string[];
}

export function searchRepository(model: RepositoryModel, query: string): SearchResult {
  const q = query.toLowerCase();

  const components = model.components.filter((component) =>
    component.name.toLowerCase().includes(q)
  );

  const symbols = model.symbols.filter((symbol) =>
    symbol.name.toLowerCase().includes(q)
  );

  const files = [
    ...new Set([
      ...components.map((component) => component.file),
      ...symbols.map((symbol) => symbol.file),
    ]),
  ];

  return {
    components,
    symbols,
    files,
  };
}
