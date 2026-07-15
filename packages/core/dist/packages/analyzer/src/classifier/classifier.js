import { collectSignals } from "./signals";
import { scoreSignals } from "./score";
export function classifyEntity(entity) {
    const signals = collectSignals(entity);
    const scores = scoreSignals(signals);
    const labels = [];
    for (const [type, confidence] of scores) {
        labels.push({
            type,
            confidence,
            signals,
        });
    }
    labels.sort((a, b) => b.confidence - a.confidence);
    return {
        entity,
        labels,
    };
}
