import { RepositoryModel } from "../types.js";
import { buildSummary } from "./summary.js";

export interface ExplainResult {
  component: string;
  type: string;
  file: string;
  symbols: string[];
  imports: string[];
  dependencies: string[];
  callers: string[];
  callees: string[];
  summary: string;
}

function normalizeTarget(value: string): string {
  return value.trim().replace(/^\.\//, "").replace(/\\/g, "/").toLowerCase();
}

function resolveComponentFromTarget(model: RepositoryModel, target: string) {
  const normalizedTarget = normalizeTarget(target);

  if (model.componentIndex.has(target)) {
    return model.componentIndex.get(target);
  }

  const byName = Array.from(model.components).find(
    (entry) => normalizeTarget(entry.name) === normalizedTarget,
  );

  if (byName) {
    return byName;
  }

  const byFile = Array.from(model.components).find(
    (entry) => normalizeTarget(entry.file) === normalizedTarget,
  );

  if (byFile) {
    return byFile;
  }

  const matchingSymbol = model.symbols.find(
    (symbol) =>
      normalizeTarget(symbol.name) === normalizedTarget ||
      normalizeTarget(symbol.file) === normalizedTarget ||
      normalizeTarget(symbol.name).includes(normalizedTarget) ||
      normalizedTarget.includes(normalizeTarget(symbol.name)),
  );

  if (matchingSymbol) {
    const existingComponent = Array.from(model.components).find(
      (entry) => normalizeTarget(entry.file) === normalizeTarget(matchingSymbol.file),
    );

    if (existingComponent) {
      return existingComponent;
    }

    return {
      id: matchingSymbol.id,
      name: matchingSymbol.name,
      type: matchingSymbol.kind,
      file: matchingSymbol.file,
      line: matchingSymbol.line,
    };
  }

  const byFilePathOnly = Array.from(model.components).find((entry) =>
    normalizeTarget(entry.file).includes(normalizedTarget) ||
    normalizedTarget.includes(normalizeTarget(entry.file)),
  );

  if (byFilePathOnly) {
    return byFilePathOnly;
  }

  return null;
}

export function explainComponent(
  model: RepositoryModel,
  name: string,
): ExplainResult | null {
  const component = resolveComponentFromTarget(model, name);

  if (!component) {
    return null;
  }

  const componentFile = component.file;
  const symbols = model.symbols
    .filter((symbol) => symbol.file === componentFile)
    .map((symbol) => symbol.name);

  const imports = model.relationships
    .filter((relationship) => relationship.from === componentFile)
    .map((relationship) => relationship.to);

  const callers = model.callGraph
    .filter((call) => symbols.includes(call.callee))
    .map((call) => call.caller);

  const callees = model.callGraph
    .filter((call) => symbols.includes(call.caller))
    .map((call) => call.callee);

  return {
    component: component.name,
    type: component.type,
    file: component.file,
    symbols,
    imports,
    dependencies: imports,
    callers,
    callees,
    summary: buildSummary({
      component: component.name,
      type: component.type,
      file: component.file,
      symbols,
      imports,
      dependencies: imports,
      callers,
      callees,
      summary: "",
    }),
  };
}
