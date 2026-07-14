import { Entity } from "../types";

export function collectSignals(entity: Entity) {
  const signals = [];

  const n = entity.name.toLowerCase();
  const f = entity.file.toLowerCase();

  const suffixes = [
    { suffix: "service", score: 0.4 },
    { suffix: "controller", score: 0.4 },
    { suffix: "module", score: 0.4 },
    { suffix: "repository", score: 0.4 },
  ] as const;

  for (const { suffix, score } of suffixes) {
    if (n.endsWith(suffix) || n.includes(suffix)) {
      signals.push({ name: `name:${suffix}`, score });
    }

    if (
      f.includes(`/` + suffix) ||
      f.includes(`.${suffix}.`) ||
      f.endsWith(`.${suffix}.ts`)
    ) {
      signals.push({ name: `folder:${suffix}`, score: score * 0.75 });
      signals.push({ name: `file:${suffix}`, score: score * 0.75 });
    }
  }

  if (
    n.endsWith("service") ||
    f.includes("/service") ||
    f.endsWith(".service.ts")
  ) {
    signals.push({ name: "name:service", score: 0.4 });
  }

  if (
    n.endsWith("controller") ||
    f.includes("/controller") ||
    f.endsWith(".controller.ts")
  ) {
    signals.push({ name: "name:controller", score: 0.4 });
  }

  if (
    n.endsWith("module") ||
    f.includes("/module") ||
    f.endsWith(".module.ts")
  ) {
    signals.push({ name: "name:module", score: 0.4 });
  }

  if (
    n.endsWith("repository") ||
    f.includes("/repository") ||
    f.endsWith(".repository.ts")
  ) {
    signals.push({ name: "name:repository", score: 0.4 });
  }

  return signals;
}
