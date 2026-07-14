import { describe, expect, it } from "vitest";
import { formatDuration, printSection } from "../src/index";

describe("shared helpers", () => {
  it("formats durations", () => {
    expect(formatDuration(2500)).toBe("2500ms");
  });

  it("prints a section header", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    printSection("Title");

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
