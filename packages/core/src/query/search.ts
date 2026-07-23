import { RepositoryModel } from "../types.js";
import { Result, matches, ok } from "@taproot/shared";

export interface SearchResult {
  components: RepositoryModel["components"];
  symbols: RepositoryModel["symbols"];
  files: string[];
}

export function searchRepository(
  model: RepositoryModel,
  query: string,
): Result<SearchResult> {
  const components = model.components.filter((component) =>
    matches(query, component.name) || matches(query, component.file),
  );
  const symbols = model.symbols.filter((symbol) =>
    matches(query, symbol.name) || matches(query, symbol.file),
  );

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
