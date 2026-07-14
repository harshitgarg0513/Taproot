export class Timer {
  private readonly start = performance.now();

  end(): number {
    return performance.now() - this.start;
  }
}
