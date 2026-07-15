import { Entity } from "../types";

export function collectSignals(entity: Entity) {
  const signals = [];
  const name = entity.name.toLowerCase();

  const suffixes = ["service", "controller", "module", "repository", "entity"];

  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) {
      signals.push({ name: `name:${suffix}`, score: 0.4 });
    }
  }

  return signals;
}
