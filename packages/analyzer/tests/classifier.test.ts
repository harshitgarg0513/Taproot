import { describe, expect, it } from "vitest";
import { classifyEntity } from "../src/classifier/classifier";

describe("classifier", () => {
  it("classifies service-like names with signal evidence", () => {
    const result = classifyEntity({
      id: "auth-service",
      kind: "Class",
      name: "AuthService",
      file: "/src/auth/auth.service.ts",
      line: 1,
    });

    expect(result.labels[0]?.type).toBe("service");
    expect(result.labels[0]?.confidence).toBeGreaterThan(0);
    expect(
      result.labels[0]?.signals.some(
        (signal) => signal.name === "name:service",
      ),
    ).toBe(true);
    expect(
      result.labels[0]?.signals.some(
        (signal) => signal.name === "folder:service",
      ),
    ).toBe(true);
    expect(
      result.labels[0]?.signals.some(
        (signal) => signal.name === "file:service",
      ),
    ).toBe(true);
  });
});
