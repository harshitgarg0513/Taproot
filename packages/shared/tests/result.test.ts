import { describe, expect, it } from "vitest";
import { err, ok } from "../src/result";
import { ParseError, RepositoryNotFoundError } from "../src/errors";

describe("shared result helpers", () => {
  it("creates success and failure results", () => {
    const success = ok("ok");
    const failure = err(new ParseError("demo.ts"));

    expect(success.success).toBe(true);
    expect(failure.success).toBe(false);
  });

  it("creates typed domain errors", () => {
    const notFound = new RepositoryNotFoundError("missing");

    expect(notFound.message).toContain("missing");
  });
});
