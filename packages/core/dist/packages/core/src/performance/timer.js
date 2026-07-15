export class Timer {
    start = performance.now();
    end() {
        return performance.now() - this.start;
    }
}
