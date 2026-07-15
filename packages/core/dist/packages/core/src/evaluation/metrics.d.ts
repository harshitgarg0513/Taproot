export interface Metrics {
    precision: number;
    recall: number;
    f1: number;
}
export declare function calculate(predicted: Set<string>, actual: Set<string>): Metrics;
