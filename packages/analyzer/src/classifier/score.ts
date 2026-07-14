import { ClassificationSignal } from "../types";

export function scoreSignals(signals: ClassificationSignal[]) {
  const score = new Map<string, number>();

  for (const signal of signals) {
    const label = signal.name.split(":")[1];
    score.set(label, (score.get(label) ?? 0) + signal.score);
  }

  return score;
}
