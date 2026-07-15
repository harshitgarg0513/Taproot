export function calculate(predicted, actual) {
    const intersection = [...predicted].filter((x) => actual.has(x)).length;
    const precision = intersection / Math.max(predicted.size, 1);
    const recall = intersection / Math.max(actual.size, 1);
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
    return {
        precision,
        recall,
        f1,
    };
}
