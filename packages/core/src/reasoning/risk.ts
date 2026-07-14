import type { RepositoryModel } from "../types.js";

export interface RiskResult {
  target: string;
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH";
  impactedFiles: string[];
  impactedSymbols: string[];
  impactedComponents: string[];
}

function normalizeTarget(value: string): string {
  return value.trim().replace(/^\.\//, "").replace(/\\/g, "/").toLowerCase();
}

function matchesTarget(value: string, target: string): boolean {
  const normalizedValue = normalizeTarget(value);
  const normalizedTarget = normalizeTarget(target);

  return (
    normalizedValue === normalizedTarget ||
    normalizedValue.includes(normalizedTarget) ||
    normalizedTarget.includes(normalizedValue)
  );
}

export function analyzeRisk(model: RepositoryModel, target: string): RiskResult {
  const normalizedTarget = normalizeTarget(target);
  const seedFiles = new Set<string>();

  for (const component of model.components) {
    if (matchesTarget(component.name, normalizedTarget) || matchesTarget(component.file, normalizedTarget)) {
      seedFiles.add(component.file);
    }
  }

  for (const symbol of model.symbols) {
    if (matchesTarget(symbol.name, normalizedTarget) || matchesTarget(symbol.file, normalizedTarget)) {
      seedFiles.add(symbol.file);
    }
  }

  const targetMatches = model.relationships.filter((relationship) => {
    const from = normalizeTarget(relationship.from);
    const to = normalizeTarget(relationship.to);
    return (
      seedFiles.has(relationship.from) ||
      seedFiles.has(relationship.to) ||
      from.includes(normalizedTarget) ||
      to.includes(normalizedTarget)
    );
  });

  const impactedFiles = Array.from(
    new Set(
      targetMatches.flatMap((relationship) => [relationship.from, relationship.to]),
    ),
  );

  const impactedSymbols = model.symbols
    .filter((symbol) => impactedFiles.includes(symbol.file))
    .map((symbol) => symbol.name);

  const impactedComponents = model.classified
    .filter((component) => impactedFiles.includes(component.entity.file))
    .map((component) => component.entity.name);

  const score = Math.min(
    100,
    impactedFiles.length * 8 + impactedSymbols.length * 0.5,
  );

  let level: RiskResult["level"];

  if (score < 30) {
    level = "LOW";
  } else if (score < 70) {
    level = "MEDIUM";
  } else {
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
